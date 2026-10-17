import type { ComparisonData } from './comparison';
import { methodNames } from './oscillator';
import { maximumQuantityError, quantityLabels, quantitySeries, type Quantity } from './quantities';

function csv(rows: (string | number)[][]): string {
  // String(number) preserves round-trip IEEE-754 precision; no display rounding.
  return '\uFEFF' + rows.map(row => row.map(value =>
    `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\r\n') + '\r\n';
}

export function simulationCsv(data: ComparisonData, quantity: Quantity): string {
  const { name, unit } = quantityLabels[quantity];
  const rows: (string | number)[][] = [['Verfahren', 'Zeit t (s)', `${name} numerisch (${unit})`, `${name} exakt (${unit})`, `Absoluter Fehler (${unit})`]];
  for (const result of data.results) {
    for (const point of quantitySeries(result.data, quantity)) {
      rows.push([methodNames[result.method], point.t, point.numerical, point.exact, point.error]);
    }
  }
  return csv(rows);
}

export function errorSummaryCsv(data: ComparisonData, quantity: Quantity): string {
  const { error, unit } = quantityLabels[quantity];
  return csv([['Verfahren', `Maximaler absoluter ${error} (${unit})`],
    ...data.results.map(result => [methodNames[result.method], maximumQuantityError(result.data, quantity)])]);
}
