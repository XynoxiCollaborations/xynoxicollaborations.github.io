import { expect, it } from 'vitest';
import { compareOscillator, defaultComparison } from '../../src/simulation/comparison';
import { simulationCsv, errorSummaryCsv } from '../../src/simulation/csv';

it.each(['position', 'energy'] as const)('exports every point without display rounding for %s', quantity => {
  const data = compareOscillator({ ...defaultComparison, methods: ['rungeKutta4'], stepCount: 80 });
  const csv = simulationCsv(data, quantity);
  const lines = csv.replace('\uFEFF', '').trim().split('\r\n');
  expect(lines).toHaveLength(82);
  expect(lines[0]).toContain(quantity === 'energy' ? '(J)' : '(m)');
  const values = lines[2].split(';').map(value => value.slice(1, -1));
  const expected = quantity === 'energy' ? data.results[0].data.energy[1].numerical : data.results[0].data.numerical[1].state[0];
  expect(Number(values[2])).toBe(expected);
  expect(lines.at(-1)).toContain('"8"');
  expect(errorSummaryCsv(data, quantity)).toContain('Runge-Kutta-4');
});

it('exports only selected methods and keeps the exact reference when hidden in charts', () => {
  const data = compareOscillator({ ...defaultComparison, methods: ['euler', 'heun'], stepCount: 10 });
  const csv = simulationCsv(data, 'position');
  expect(csv).toContain('exakt (m)');
  expect(csv.match(/"Euler"/g)).toHaveLength(11);
  expect(csv.match(/"Heun"/g)).toHaveLength(11);
  expect(csv).not.toContain('Leapfrog');
});
