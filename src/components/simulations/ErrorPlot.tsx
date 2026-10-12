import { quantityLabels, type Quantity } from '../../simulation/quantities';
import { useMemo } from 'react';
import type { ComparisonData } from '../../simulation/comparison';
import { errorTraces } from '../../visualization/traces';
import Plot from './Plot';
export default function ErrorPlot({ data, quantity }: { data: ComparisonData; quantity: Quantity }) {
  const traces = useMemo(() => errorTraces(data, quantity), [data, quantity]);
  const label = quantityLabels[quantity];
  return <Plot traces={traces} title={`Absoluter ${label.error}`} yLabel={`${label.error} (${label.unit})`} />;
}
