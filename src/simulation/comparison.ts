import { methodNames, simulateOscillator, type Method, type SimulationData } from './oscillator';
import { harmonicOscillator } from '../math/systems/harmonicOscillator';
import { exactOscillator } from '../math/systems/exactSolutions';
import type { Solution } from '../math/types';
import { oscillatorEnergy } from '../math/systems/oscillatorEnergy';

export interface ComparisonParameters {
  methods: readonly Method[];
  stepSize: number;
  stepCount: number;
  position: number;
  velocity: number;
  springConstant: number;
  mass: number;
}
export interface MethodResult { method: Method; data: SimulationData }
export interface ComparisonData { duration: number; results: MethodResult[]; exact: Solution; exactEnergy: number }
export const controlLimits = {
  stepSize: { min: 0.01, max: 0.5, step: 0.01 },
  stepCount: { min: 10, max: 1000, step: 1 },
} as const;
export const advancedControlLimits = {
  stepSize: { min: 0.001, max: 5, step: 0.001 },
  stepCount: { min: 10, max: 100_000, step: 1 },
} as const;
export const defaultComparison: ComparisonParameters = {
  methods: Object.keys(methodNames) as Method[], stepSize: 0.1, stepCount: 200,
  position: 1, velocity: 0, springConstant: 1, mass: 1,
};
export function simulationDuration(parameters: Pick<ComparisonParameters, 'stepSize' | 'stepCount'>): number {
  return parameters.stepSize * parameters.stepCount;
}
/** The UI specifies N full steps; all methods share the same time interval. */
export function compareOscillator(parameters: ComparisonParameters): ComparisonData {
  const { stepCount, stepSize } = parameters;
  if (!Number.isInteger(stepCount) || stepCount < 1 || stepCount > 100_000) {
    throw new Error('Die Schrittzahl N muss eine natürliche Zahl von 1 bis 100 000 sein.');
  }
  const duration = simulationDuration(parameters);
  const { position, velocity, springConstant, mass } = parameters;
  harmonicOscillator(springConstant, mass);
  if (stepSize <= 0 || ![stepSize, duration, position, velocity].every(Number.isFinite)) {
    throw new Error('Schrittweite und Anfangswerte müssen endlich sein; h muss positiv sein.');
  }
  const methods = (Object.keys(methodNames) as Method[]).filter(method => parameters.methods.includes(method));
  const results = methods.map(method => ({ method, data: simulateOscillator({ ...parameters, method, stepSize, duration }) }));
  // Keep the analytical reference available even when no numerical method is selected.
  const exact = results[0]?.data.exact ?? Array.from({ length: stepCount + 1 }, (_, index) => {
    const t = index === stepCount ? duration : index * stepSize;
    return { t, state: exactOscillator(t, position, velocity, springConstant, mass) };
  });
  return { duration, results, exact, exactEnergy: oscillatorEnergy(position, velocity, springConstant, mass) };
}
