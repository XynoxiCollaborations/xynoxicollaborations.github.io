import type { PlotData } from 'plotly.js';
import type { ComparisonData } from '../simulation/comparison';
import { methodNames, type Method } from '../simulation/oscillator';
import { quantitySeries, type Quantity } from '../simulation/quantities';
export type LineTrace = Partial<PlotData>;

// CSS variables are resolved by Plot; each method keeps its color in both graphs.
function methodLine(method: Method) { return { color: `var(--method-${method})`, width: 2 }; }
export function solutionTraces(data: ComparisonData, showExact: boolean, quantity: Quantity = 'position'): LineTrace[] {
  const traces: LineTrace[] = data.results.map(({ method, data }) => ({
    x: data.numerical.map(p => p.t), y: quantitySeries(data, quantity).map(p => p.numerical),
    type: 'scatter', mode: 'lines', name: methodNames[method], line: methodLine(method),
  }));
  if (showExact) {
    const exact = data.exact;
    traces.push({ x: exact.map(p => p.t), y: exact.map(p => quantity === 'energy' ? data.exactEnergy : p.state[0]), type: 'scatter',
      mode: 'lines', name: 'Exakte Lösung', line: { color: 'var(--exact)', dash: 'dash', width: 2 } });
  }
  return traces;
}
export function errorTraces(data: ComparisonData, quantity: Quantity = 'position'): LineTrace[] {
  return data.results.map(({ method, data }) => ({
    x: data.numerical.map(p => p.t), y: quantitySeries(data, quantity).map(p => p.error),
    type: 'scatter', mode: 'lines', name: methodNames[method], line: methodLine(method),
  }));
}
