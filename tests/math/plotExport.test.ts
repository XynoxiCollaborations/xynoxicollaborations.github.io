import { expect, it, vi } from 'vitest';
import { downloadPlot } from '../../src/visualization/downloadPlot';
import { downloadImage } from 'plotly.js-basic-dist-min';

vi.mock('plotly.js-basic-dist-min', () => ({ downloadImage: vi.fn().mockResolvedValue('image') }));
vi.mock('../../src/visualization/plotTheme', () => ({ themedPlot: (_element: unknown, traces: unknown) => ({ traces, layout: {} }) }));

it.each(['Position x (m)', 'Gesamtenergie E (J)', 'Energiefehler (J)'])('exports the title and correct axes for %s', yLabel => {
  return downloadPlot({} as HTMLElement, [], 'Diagrammtitel', yLabel).then(() => {
    expect(downloadImage).toHaveBeenLastCalledWith(expect.objectContaining({ layout: expect.objectContaining({
      title: { text: 'Diagrammtitel' }, xaxis: { title: { text: 'Zeit t (s)' } }, yaxis: { title: { text: yLabel } },
    }) }), expect.objectContaining({ format: 'png', width: 1600, height: 1000 }));
  });
});
