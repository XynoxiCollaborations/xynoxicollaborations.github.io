import { euler } from '../math/methods/euler';
import { eulerCromer } from '../math/methods/eulerCromer';
import { heun } from '../math/methods/heun';
import { rungeKutta4 } from '../math/methods/rungeKutta4';
import { leapfrog } from '../math/methods/leapfrog';
import { asFirstOrder, pack } from '../math/mechanics';
import { harmonicOscillator } from '../math/systems/harmonicOscillator';
import { exactOscillator } from '../math/systems/exactSolutions';
import type { Solution } from '../math/types';

export const methodNames = { euler: 'Euler', eulerCromer: 'Euler-Cromer', heun: 'Heun',
  leapfrog: 'Leapfrog', rungeKutta4: 'Runge-Kutta-4' } as const;
export type Method = keyof typeof methodNames;
export interface SimulationParameters {
  method: Method; stepSize: number; duration: number; position: number; velocity: number;
}
export interface SimulationData {
  numerical: Solution; exact: Solution; positionError: { t: number; error: number }[];
  maxPositionError: number;
}
export const defaultParameters: SimulationParameters = {
  method: 'rungeKutta4', stepSize: 0.1, duration: 20, position: 1, velocity: 0,
};
export function simulateOscillator(parameters: SimulationParameters): SimulationData {
  const { method, stepSize, duration, position, velocity } = parameters;
  const system = harmonicOscillator();
  const initial = { position: [position], velocity: [velocity] };
  const options = { stepSize, duration };
  let numerical: Solution;
  switch (method) {
    case 'eulerCromer': numerical = eulerCromer(system, initial, options); break;
    case 'leapfrog': numerical = leapfrog(system, initial, options); break;
    default: {
      const solver = { euler, heun, rungeKutta4 }[method];
      numerical = solver(asFirstOrder(system, 1), pack(initial), options);
    }
  }
  const exact = numerical.map(({ t }) => ({ t, state: exactOscillator(t, position, velocity) }));
  const positionError = numerical.map(({ t, state }, index) =>
    ({ t, error: Math.abs(state[0] - exact[index].state[0]) }));
  return { numerical, exact, positionError,
    maxPositionError: positionError.reduce((max, point) => Math.max(max, point.error), 0) };
}
