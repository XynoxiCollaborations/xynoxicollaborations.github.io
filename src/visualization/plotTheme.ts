import type { Layout } from 'plotly.js';
import type { LineTrace } from './traces';

/** Read the site's design tokens only in the browser, never in the math layer. */
export function themedPlot(element: HTMLElement, traces: LineTrace[]): { traces: LineTrace[]; layout: Partial<Layout> } {
  const styles = getComputedStyle(element);
  const color = (name: string) => styles.getPropertyValue(name).trim();
  const themedTraces = traces.map(trace => {
    if (!('line' in trace) || !trace.line || typeof trace.line.color !== 'string') return trace;
    const token = /^var\((--[^)]+)\)$/.exec(trace.line.color);
    return token ? { ...trace, line: { ...trace.line, color: color(token[1]) } } : trace;
  });
  return { traces: themedTraces, layout: {
    paper_bgcolor: color('--surface'), plot_bgcolor: color('--surface'),
    font: { family: 'system-ui, sans-serif', color: color('--muted'), size: 12 },
    xaxis: { title: { text: 'Zeit t (s)' }, gridcolor: color('--plot-grid'), zerolinecolor: color('--border'), automargin: true },
    yaxis: { gridcolor: color('--plot-grid'), zerolinecolor: color('--border'), automargin: true },
  } };
}
