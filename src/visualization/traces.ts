import type { PlotData } from 'plotly.js';
import type { ComparisonData } from '../simulation/comparison';
import { methodNames, type Method } from '../simulation/oscillator';
export type LineTrace = Partial<PlotData>;

// CSS variables are resolved by Plot; each method keeps its color in both graphs.
function methodLine(method: Method) { return { color: `var(--method-${method})`, width: 2 }; }
export function solutionTraces(data: ComparisonData, showExact: boolean): LineTrace[] {
  const traces: LineTrace[] = data.results.map(({ method, data }) => ({
    x: data.numerical.map(p => p.t), y: data.numerical.map(p => p.state[0]),
    type: 'scatter', mode: 'lines', name: methodNames[method], line: methodLine(method),
  }));
  if (showExact && data.results.length) {
    const exact = data.results[0].data.exact;
    traces.push({ x: exact.map(p => p.t), y: exact.map(p => p.state[0]), type: 'scatter',
      mode: 'lines', name: 'Exakte Lösung', line: { color: 'var(--exact)', dash: 'dash', width: 2 } });
  }
  return traces;
}
export function errorTraces(data: ComparisonData): LineTrace[] {
  return data.results.map(({ method, data }) => ({
    x: data.positionError.map(p => p.t), y: data.positionError.map(p => p.error),
    type: 'scatter', mode: 'lines', name: methodNames[method], line: methodLine(method),
  }));
}
