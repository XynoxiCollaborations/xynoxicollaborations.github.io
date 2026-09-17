import { expect, it } from 'vitest';
import { eulerCromer } from '../../src/math/methods/eulerCromer';
import { leapfrog } from '../../src/math/methods/leapfrog';
import { harmonicOscillator } from '../../src/math/systems/harmonicOscillator';
import { exactOscillator } from '../../src/math/systems/exactSolutions';
import { defaultParameters, simulateOscillator } from '../../src/simulation/oscillator';
const initial = { position: [1], velocity: [0] };
const options = { duration: 0.1, stepSize: 0.1 };
it('Euler-Cromer updates velocity before position', () => {
  const state = eulerCromer(harmonicOscillator(), initial, options)[1].state;
  expect(state[0]).toBeCloseTo(0.99, 12);
  expect(state[1]).toBeCloseTo(-0.1, 12);
});
it('leapfrog returns synchronized position and full-step velocity', () => {
  const state = leapfrog(harmonicOscillator(), initial, options)[1].state;
  expect(state[0]).toBeCloseTo(0.995, 12);
  expect(state[1]).toBeCloseTo(-0.09975, 12);
});
it('handles multiple coordinates and a shortened final step', () => {
  const result = leapfrog({ acceleration: () => [2, -4] },
    { position: [0, 1], velocity: [3, 0] }, { duration: 1, stepSize: 0.3 }).at(-1)!;
  [4, -1, 5, -4].forEach((value, index) => expect(result.state[index]).toBeCloseTo(value, 12));
});
it('leapfrog converges at second order', () => {
  const coarse = simulateOscillator({ ...defaultParameters, method: 'leapfrog', stepSize: 0.2 });
  const fine = simulateOscillator({ ...defaultParameters, method: 'leapfrog', stepSize: 0.1 });
  expect(coarse.maxPositionError / fine.maxPositionError).toBeGreaterThan(3.5);
  expect(coarse.maxPositionError / fine.maxPositionError).toBeLessThan(4.5);
});
it('exact solution respects nonzero initial time and velocity', () => {
  expect(exactOscillator(3, 2, -1, 4, 2, 3)).toEqual([2, -1]);
  const state = exactOscillator(Math.PI / 4, 0, 2, 4, 1);
  expect(state[0]).toBeCloseTo(1, 12);
  expect(state[1]).toBeCloseTo(0, 12);
});
