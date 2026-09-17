import { expect, it } from 'vitest';
import { rungeKutta4 } from '../../src/math/methods/rungeKutta4';
import { simulateOscillator, defaultParameters } from '../../src/simulation/oscillator';
it('matches the RK4 exponential polynomial in one step', () => {
  expect(rungeKutta4({ derivative: (_t, y) => y }, [1], { duration: 0.1, stepSize: 0.1 })[1].state[0]).toBeCloseTo(1.1051708333333333, 12);
});
it('is substantially more accurate than Euler over ten seconds', () => {
  const parameters = { ...defaultParameters, duration: 10, stepSize: 0.1 };
  const rk4 = simulateOscillator({ ...parameters, method: 'rungeKutta4' });
  const euler = simulateOscillator({ ...parameters, method: 'euler' });
  expect(rk4.maxPositionError).toBeLessThan(0.00001);
  expect(rk4.maxPositionError).toBeLessThan(euler.maxPositionError / 1000);
});
