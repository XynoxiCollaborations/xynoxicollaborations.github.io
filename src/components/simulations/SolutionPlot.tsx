import { useMemo } from 'react';
import type { ComparisonData } from '../../simulation/comparison';
import { solutionTraces } from '../../visualization/traces';
import Plot from './Plot';
export default function SolutionPlot({ data, showExact }: { data: ComparisonData; showExact: boolean }) {
  const traces = useMemo(() => solutionTraces(data, showExact), [data, showExact]);
  return <Plot traces={traces} title="Position im Zeitverlauf" yLabel="Position x (m)" />;
}
