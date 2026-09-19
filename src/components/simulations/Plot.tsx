import { useEffect, useRef, useState } from 'react';
import type { LineTrace } from '../../visualization/traces';
import { themedPlot } from '../../visualization/plotTheme';

export default function Plot({ traces, title, yLabel }: { traces: LineTrace[]; title: string; yLabel: string }) {
  const element = useRef<HTMLDivElement>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const revision = useRef(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const target = element.current;
    if (!target) return;
    let disposed = false;
    let observer: ResizeObserver | undefined;
    void import('plotly.js-basic-dist-min').then(Plotly => {
      if (disposed) return;
      observer = new ResizeObserver(() => {
        void queue.current.then(() => { if (!disposed) return Plotly.Plots.resize(target); }).catch(() => {});
      });
      observer.observe(target);
    }).catch(() => { if (!disposed) setError(true); });
    return () => {
      disposed = true;
      revision.current++;
      observer?.disconnect();
      void queue.current.then(async () => {
        const Plotly = await import('plotly.js-basic-dist-min');
        Plotly.purge(target);
      }).catch(() => {});
    };
  }, []);

  useEffect(() => {
    const target = element.current;
    if (!target) return;
    const current = ++revision.current;
    // Serialize Plotly updates and skip outdated slider events. Never purge on updates.
    queue.current = queue.current.catch(() => {}).then(async () => {
      const Plotly = await import('plotly.js-basic-dist-min');
      if (current !== revision.current) return;
      const theme = themedPlot(target, traces);
      await Plotly.react(target, theme.traces, {
        ...theme.layout, autosize: true, height: 420,
        margin: { l: 55, r: 16, b: 120, t: 24 },
        yaxis: { ...theme.layout.yaxis, title: { text: yLabel } },
        legend: { orientation: 'h', y: -0.28, x: 0, font: { size: 11 } },
        hovermode: 'x', dragmode: 'zoom',
      }, { responsive: true, displaylogo: false, scrollZoom: false, displayModeBar: false });
      if (current === revision.current) setError(false);
    }).catch(() => { if (current === revision.current) setError(true); });
  }, [traces, yLabel]);

  return <figure className="plot-card">
    <figcaption>{title}</figcaption>
    {error && <p role="alert">Das Diagramm konnte nicht geladen werden. Bitte Seite neu laden.</p>}
    <div ref={element} className="plot" role="img" aria-label={`${title}. ${yLabel} über der Zeit. Werte in der nachfolgenden Tabelle.`} />
    <p className="plot-hint">Ziehen zum Zoomen · Doppelklick zum Zurücksetzen</p>
  </figure>;
}
