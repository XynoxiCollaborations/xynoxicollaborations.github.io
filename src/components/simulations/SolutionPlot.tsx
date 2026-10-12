import { quantityLabels, type Quantity } from '../../simulation/quantities';
import { useMemo } from 'react';
import type { ComparisonData } from '../../simulation/comparison';
import { solutionTraces } from '../../visualization/traces';
import Plot from './Plot';
export default function SolutionPlot({ data, showExact, quantity }: { data: ComparisonData; quantity: Quantity; showExact: boolean }) {
  const traces = useMemo(() => solutionTraces(data, showExact, quantity), [data, showExact, quantity]);
  const label = quantityLabels[quantity];
  return <Plot traces={traces} title={label.title} yLabel={label.axis} />;
}
