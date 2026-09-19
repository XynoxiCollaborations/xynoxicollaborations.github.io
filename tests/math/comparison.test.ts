import { expect, it } from 'vitest';
import { compareOscillator, defaultComparison } from '../../src/simulation/comparison';
import { methodNames } from '../../src/simulation/oscillator';
import { solutionTraces, errorTraces } from '../../src/visualization/traces';

it('compares every method on exactly N steps over T = N h', () => {
  const result = compareOscillator({ ...defaultComparison, stepSize: 0.07, stepCount: 203 });
  expect(result.results.map(r => r.method)).toEqual(Object.keys(methodNames));
  for (const { data } of result.results) {
    expect(data.numerical).toHaveLength(204);
    expect(data.numerical.at(-1)!.t).toBeCloseTo(14.21, 12);
    expect(data.numerical.map(p => p.t)).toEqual(data.exact.map(p => p.t));
    expect(data.positionError[0].error).toBe(0);
  }
});

it('single-method selection matches the corresponding all-method result', () => {
  const all = compareOscillator(defaultComparison);
  const single = compareOscillator({ ...defaultComparison, method: 'heun' });
  expect(single.results).toHaveLength(1);
  expect(single.results[0]).toEqual(all.results.find(r => r.method === 'heun'));
});

it.each([0, -1, 2.5, NaN, Infinity, 100001])('rejects invalid step count %s', stepCount => {
  expect(() => compareOscillator({ ...defaultComparison, stepCount })).toThrow();
});

it('shows exactly one optional exact trace and preserves error data when hidden', () => {
  const data = compareOscillator(defaultComparison);
  expect(solutionTraces(data, true)).toHaveLength(6);
  expect(solutionTraces(data, false)).toHaveLength(5);
  expect(solutionTraces(data, true).filter(t => t.name === 'Exakte Lösung')).toHaveLength(1);
  const errors = errorTraces(data);
  expect(errors).toHaveLength(5);
  const solutions = solutionTraces(data, false);
  expect(new Set(solutions.map(t => 'line' in t && t.line?.color)).size).toBe(5);
  errors.forEach((trace, i) => {
    expect(trace.name).toBe(solutions[i].name);
    expect('line' in trace && trace.line).toEqual('line' in solutions[i] && solutions[i].line);
  });
});

it('updates time interval and solutions when h or N changes', () => {
  const base = compareOscillator({ ...defaultComparison, method: 'euler' });
  const changed = compareOscillator({ ...defaultComparison, method: 'euler', stepSize: 0.2, stepCount: 100 });
  expect(changed.duration).toBe(base.duration);
  expect(changed.results[0].data.numerical).toHaveLength(101);
  expect(changed.results[0].data.maxPositionError).toBeGreaterThan(base.results[0].data.maxPositionError);
});
