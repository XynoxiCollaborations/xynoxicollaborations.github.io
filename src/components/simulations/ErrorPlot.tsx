import { useMemo } from 'react';
import type { ComparisonData } from '../../simulation/comparison';
import { errorTraces } from '../../visualization/traces';
import Plot from './Plot';
export default function ErrorPlot({ data }: { data: ComparisonData }) {
  const traces = useMemo(() => errorTraces(data), [data]);
  return <Plot traces={traces} title="Absoluter Positionsfehler" yLabel="Positionsfehler (m)" />;
}
