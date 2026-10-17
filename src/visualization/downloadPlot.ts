import { themedPlot } from './plotTheme';
import type { LineTrace } from './traces';

/** Export a full-resolution snapshot, independent of the screen size and zoom. */
export async function downloadPlot(element: HTMLElement, traces: LineTrace[], title: string, yLabel: string): Promise<void> {
  const theme = themedPlot(element, traces);
  const Plotly = await import('plotly.js-basic-dist-min');
  await Plotly.downloadImage({ data: theme.traces, layout: {
    ...theme.layout, title: { text: title },
    width: 1600, height: 1000,
    margin: { l: 140, r: 60, t: 100, b: 180 },
    font: { ...theme.layout.font, size: 20 },
    xaxis: { ...theme.layout.xaxis, title: { text: 'Zeit t (s)' } },
    yaxis: { ...theme.layout.yaxis, title: { text: yLabel } },
    legend: { orientation: 'h', y: -0.18, x: 0 },
  } }, { format: 'png', width: 1600, height: 1000, filename: `simplemath-${title.replaceAll(' ', '-')}` });
}
