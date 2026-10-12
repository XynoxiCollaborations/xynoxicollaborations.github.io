import { expect, it } from 'vitest';
import { oscillatorEnergy } from '../../src/math/systems/oscillatorEnergy';
import { compareOscillator, defaultComparison } from '../../src/simulation/comparison';
import { quantitySeries } from '../../src/simulation/quantities';
import { solutionTraces, errorTraces } from '../../src/visualization/traces';

it('includes spring and kinetic energy with the specified D and m', () => {
  expect(oscillatorEnergy(2, -3, 8, 4)).toBe(34);
});

it('compares Euler energy against the conserved initial energy', () => {
  const result = compareOscillator({ ...defaultComparison, methods: ['euler'], springConstant: 8, mass: 2, stepCount: 1 });
  // x1 = 1, v1 = -0.4, E1 = 4 + 0.16 J; E0 = 4 J.
  const series = quantitySeries(result.results[0].data, 'energy');
  expect(series[0].error).toBe(0);
  expect(series[1].numerical).toBeCloseTo(4.16, 12);
  expect(series[1].exact).toBe(4);
  expect(series[1].error).toBeCloseTo(0.16, 12);
  expect(solutionTraces(result, true, 'energy')[0].y).toEqual(series.map(p => p.numerical));
  expect(solutionTraces(result, true, 'energy')[1].y).toEqual([4, 4]);
  expect(errorTraces(result, 'energy')[0].y).toEqual(series.map(p => p.error));
});

it('keeps an exact energy reference with no selected methods and nonzero initial velocity', () => {
  const result = compareOscillator({ ...defaultComparison, methods: [], position: 2, velocity: -3, springConstant: 8, mass: 4 });
  expect(result.exactEnergy).toBe(34);
  expect(solutionTraces(result, true, 'energy')[0].y).toEqual(Array(201).fill(34));
  expect(solutionTraces(result, false, 'energy')).toEqual([]);
  expect(errorTraces(result, 'energy')).toEqual([]);
});

it('RK4 has substantially less energy drift than Euler', () => {
  const result = compareOscillator({ ...defaultComparison, methods: ['euler', 'rungeKutta4'] });
  const maximum = result.results.map(({ data }) => Math.max(...data.energy.map(p => p.error)));
  expect(maximum[1]).toBeLessThan(maximum[0] / 1000);
});

it('all methods preserve zero energy for the resting equilibrium', () => {
  const result = compareOscillator({ ...defaultComparison, position: 0, velocity: 0 });
  for (const { data } of result.results) expect(data.energy.every(p => p.numerical === 0 && p.error === 0)).toBe(true);
});
