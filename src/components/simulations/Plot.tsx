import { useEffect, useRef, useState } from 'react';
import type { LineTrace } from '../../visualization/traces';
import { themedPlot } from '../../visualization/plotTheme';
import { downloadPlot } from '../../visualization/downloadPlot';

export default function Plot({ traces, title, yLabel }: { traces: LineTrace[]; title: string; yLabel: string }) {
  const element = useRef<HTMLDivElement>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const revision = useRef(0);
  const [error, setError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);
  async function exportImage() {
    if (!element.current || exporting) return;
    setExporting(true);
    setExportError(false);
    try { await downloadPlot(element.current, traces, title, yLabel); }
    catch { setExportError(true); }
    finally { setExporting(false); }
  }
  const [themeVersion, setThemeVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setThemeVersion(version => version + 1);
    window.addEventListener('themechange', refresh);
    return () => window.removeEventListener('themechange', refresh);
  }, []);

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
  }, [traces, yLabel, themeVersion]);

  return <figure className="plot-card">
    <figcaption>{title}</figcaption>
    {error && <p role="alert">Das Diagramm konnte nicht geladen werden. Bitte Seite neu laden.</p>}
    <div ref={element} className="plot" role="img" aria-label={`${title}. ${yLabel} über der Zeit.`} />
    {exportError && <p role="alert">Bildexport fehlgeschlagen. Bitte erneut versuchen.</p>}
    <div className="plot-footer">
      <p className="plot-hint">Ziehen zum Zoomen · Doppelklick zum Zurücksetzen</p>
      <button className="plot-download" type="button" disabled={exporting} onClick={exportImage}
        aria-busy={exporting} aria-label={`${title} als PNG herunterladen`}
        title={exporting ? 'Bild wird erstellt …' : 'Diagramm als PNG herunterladen'}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></svg>
      </button>
    </div>
  </figure>;
}
