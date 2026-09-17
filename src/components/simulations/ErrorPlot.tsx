import { useMemo } from 'react';
import type { SimulationData } from '../../simulation/oscillator';
import { errorTraces } from '../../visualization/traces';
import Plot from './Plot';
export default function ErrorPlot({ data }: { data: SimulationData }) {
  const traces = useMemo(() => errorTraces(data), [data]);
  return <Plot traces={traces} title="Absoluter Positionsfehler" yLabel="|x numerisch − x exakt| (m)" />;
}
