import { useEffect, useRef, useState } from 'react';
import type { Data } from 'plotly.js';

export default function Plot({ traces, title, yLabel }: { traces: Data[]; title: string; yLabel: string }) {
  const element = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const target = element.current;
    if (!target) return;
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    let cleanup: (() => void) | undefined;
    setError(false);
    // Plotly touches browser globals, so import only after the island mounts.
    void import('plotly.js-basic-dist-min').then(async Plotly => {
      if (cancelled) return;
      cleanup = () => Plotly.purge(target);
      await Plotly.react(target, traces, {
        title: { text: title }, autosize: true, height: 360,
        margin: { l: 65, r: 20, b: 90, t: 55 },
        xaxis: { title: { text: 'Zeit t (s)' } }, yaxis: { title: { text: yLabel } },
        legend: { orientation: 'h', y: -0.2 }, font: { family: 'system-ui, sans-serif' },
      }, { responsive: true, displaylogo: false, scrollZoom: false });
      if (cancelled) { Plotly.purge(target); return; }
      observer = new ResizeObserver(() => { void Plotly.Plots.resize(target); });
      observer.observe(target);
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; observer?.disconnect(); cleanup?.(); };
  }, [traces, title, yLabel]);
  return <>{error && <p role="alert">Das Diagramm konnte nicht geladen werden. Bitte Seite neu laden.</p>}
    <div ref={element} className="plot" role="img" aria-label={`${title}. ${yLabel} über der Zeit.`} /></>;
}
