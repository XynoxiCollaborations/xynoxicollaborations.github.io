import type { Data } from 'plotly.js';
import type { SimulationData } from '../simulation/oscillator';
export function solutionTraces(data: SimulationData): Data[] {
  return [
    { x: data.exact.map(p => p.t), y: data.exact.map(p => p.state[0]),
      type: 'scatter', mode: 'lines', name: 'Exakte Lösung', line: { color: '#9a4515', dash: 'dash' } },
    { x: data.numerical.map(p => p.t), y: data.numerical.map(p => p.state[0]),
      type: 'scatter', mode: 'lines', name: 'Numerische Lösung', line: { color: '#165f77' } },
  ];
}
export function errorTraces(data: SimulationData): Data[] {
  return [{ x: data.positionError.map(p => p.t), y: data.positionError.map(p => p.error),
    type: 'scatter', mode: 'lines', name: 'Absoluter Positionsfehler', line: { color: '#165f77' } }];
}
