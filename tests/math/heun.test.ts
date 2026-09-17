import { expect, it } from 'vitest';
import { heun } from '../../src/math/methods/heun';
it('averages initial and predicted slopes for y′ = y', () => {
  expect(heun({ derivative: (_t, y) => y }, [1], { duration: 0.1, stepSize: 0.1 })[1].state[0]).toBeCloseTo(1.105, 12);
});
it('integrates y′ = t exactly', () => {
  expect(heun({ derivative: t => [t] }, [0], { duration: 1, stepSize: 1 })[1].state[0]).toBeCloseTo(0.5, 12);
});
