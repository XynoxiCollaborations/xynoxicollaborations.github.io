import { expect, it } from 'vitest';
import { euler } from '../../src/math/methods/euler';
it('uses the initial slope for y′ = y', () => {
  expect(euler({ derivative: (_t, y) => y }, [1], { duration: 0.1, stepSize: 0.1 })[1].state[0]).toBeCloseTo(1.1, 12);
});
it('uses the current time for nonautonomous systems', () => {
  expect(euler({ derivative: t => [t] }, [0], { startTime: 2, duration: 0.1, stepSize: 0.1 })[1].state[0]).toBeCloseTo(0.2, 12);
});
