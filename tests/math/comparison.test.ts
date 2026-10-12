import { expect, it } from 'vitest';
import { compareOscillator, defaultComparison } from '../../src/simulation/comparison';
import { methodNames, type Method } from '../../src/simulation/oscillator';
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
  const single = compareOscillator({ ...defaultComparison, methods: ['heun'] });
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
  const base = compareOscillator({ ...defaultComparison, methods: ['euler'] });
  const changed = compareOscillator({ ...defaultComparison, methods: ['euler'], stepSize: 0.2, stepCount: 100 });
  expect(changed.duration).toBe(base.duration);
  expect(changed.results[0].data.numerical).toHaveLength(101);
  expect(changed.results[0].data.maxPositionError).toBeGreaterThan(base.results[0].data.maxPositionError);
});

it.each(Array.from({ length: 32 }, (_, mask) => mask))('supports method combination %i', mask => {
  const methods = (Object.keys(methodNames) as Method[]).filter((_, index) => mask & (1 << index));
  const data = compareOscillator({ ...defaultComparison, methods });
  expect(data.results.map(result => result.method)).toEqual(methods);
  expect(solutionTraces(data, false)).toHaveLength(methods.length);
  expect(solutionTraces(data, true)).toHaveLength(methods.length + 1);
  expect(errorTraces(data)).toHaveLength(methods.length);
  expect(data.exact).toHaveLength(201);
});

it.each([
  ['euler', 1, -0.4], ['eulerCromer', 0.96, -0.4], ['heun', 0.98, -0.4],
  ['leapfrog', 0.98, -0.396], ['rungeKutta4', 0.9800666666666666, -0.3973333333333333],
] as const)('uses D/m in %s and in the analytical reference', (method, x, v) => {
  const data = compareOscillator({ ...defaultComparison, methods: [method], springConstant: 8, mass: 2, stepCount: 1 });
  const last = data.results[0].data.numerical[1];
  expect(last.state[0]).toBeCloseTo(x, 12);
  expect(last.state[1]).toBeCloseTo(v, 12);
  expect(data.exact[1].state[0]).toBeCloseTo(Math.cos(0.2), 12);
  expect(data.exact[1].state[1]).toBeCloseTo(-2 * Math.sin(0.2), 12);
  expect(data.results[0].data.positionError[1].error).toBeCloseTo(Math.abs(x - Math.cos(0.2)), 12);
});

it('keeps an independent exact solution when all methods are hidden', () => {
  const parameters = { ...defaultComparison, springConstant: 9, mass: 4, position: 2, velocity: -1 };
  const none = compareOscillator({ ...parameters, methods: [] });
  const all = compareOscillator(parameters);
  expect(none.exact).toEqual(all.exact);
});

it.each([0, -1, NaN, Infinity])('rejects invalid D or m (%s), even without numerical methods', value => {
  expect(() => compareOscillator({ ...defaultComparison, methods: [], springConstant: value })).toThrow();
  expect(() => compareOscillator({ ...defaultComparison, methods: [], mass: value })).toThrow();
});
