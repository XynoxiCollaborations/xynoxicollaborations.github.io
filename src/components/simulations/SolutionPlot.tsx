import { useMemo } from 'react';
import type { SimulationData } from '../../simulation/oscillator';
import { solutionTraces } from '../../visualization/traces';
import Plot from './Plot';
export default function SolutionPlot({ data }: { data: SimulationData }) {
  const traces = useMemo(() => solutionTraces(data), [data]);
  return <Plot traces={traces} title="Position im Zeitverlauf" yLabel="Position x (m)" />;
}
