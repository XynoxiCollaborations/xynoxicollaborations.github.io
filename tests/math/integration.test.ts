import { expect, it } from 'vitest';
import { euler } from '../../src/math/methods/euler';
import { heun } from '../../src/math/methods/heun';
import { rungeKutta4 } from '../../src/math/methods/rungeKutta4';
const constant = { derivative: () => [1] };
it.each([euler, heun, rungeKutta4])('preserves input and shortens the final step', solver => {
  const initial = Object.freeze([0]);
  const result = solver(constant, initial, { duration: 1, stepSize: 0.3 });
  expect(result).toHaveLength(5);
  expect(result.at(-1)!.t).toBe(1);
  expect(result.at(-1)!.state[0]).toBeCloseTo(1, 12);
  expect(initial).toEqual([0]);
});
it.each([0, -1, NaN, Infinity])('rejects invalid step size %s', stepSize => {
  expect(() => euler(constant, [0], { duration: 1, stepSize })).toThrow();
});
it('rejects excessive work and malformed derivatives', () => {
  expect(() => euler(constant, [0], { duration: 1, stepSize: 1e-9 })).toThrow();
  expect(() => euler({ derivative: () => [] }, [0], { duration: 1, stepSize: 1 })).toThrow();
  expect(() => euler(constant, [NaN], { duration: 1, stepSize: 1 })).toThrow();
});
it('allows zero duration', () => {
  expect(euler(constant, [2], { duration: 0, stepSize: 1 })).toEqual([{ t: 0, state: [2] }]);
});
it('does not add a zero-length step from decimal rounding', () => {
  const result = euler(constant, [0], { duration: 0.07, stepSize: 0.01 });
  expect(result).toHaveLength(8);
  expect(result.at(-1)!.t).toBe(0.07);
  expect(result.at(-1)!.state[0]).toBeCloseTo(0.07, 14);
});
