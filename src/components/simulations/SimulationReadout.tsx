import { quantityLabels, quantitySeries, maximumQuantityError, type Quantity } from '../../simulation/quantities';
import type { ComparisonData } from '../../simulation/comparison';
import { methodNames } from '../../simulation/oscillator';
import { simulationCsv, errorSummaryCsv } from '../../simulation/csv';
import { downloadText } from '../../lib/downloadText';

export default function SimulationReadout({ data, quantity }: { data: ComparisonData; quantity: Quantity }) {
  const label = quantityLabels[quantity];
  return <>
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Fehlervergleich">
      <table><caption>Maximaler absoluter {label.error} an den Stützstellen</caption>
        <thead><tr><th scope="col">Verfahren</th><th scope="col">Fehler ({label.unit})</th></tr></thead>
        <tbody>{data.results.map(({ method, data }) => <tr key={method}>
          <th scope="row">{methodNames[method]}</th><td>{maximumQuantityError(data, quantity).toExponential(3)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className="csv-downloads" aria-label="Tabellen herunterladen">
      <button type="button" title="Alle Stützstellen als CSV, ohne zusätzliche Rundung" onClick={() => downloadText(simulationCsv(data, quantity), `simplemath-${quantity}-werte.csv`)}>alle Werte herunterladen</button>
      <span aria-hidden="true">·</span>
      <button type="button" title="Maximale Fehler als CSV" onClick={() => downloadText(errorSummaryCsv(data, quantity), `simplemath-${quantity}-fehler.csv`)}>Fehlervergleich herunterladen</button>
    </div>
    <details className="result-details"><summary>Wertetabellen zu den Diagrammen</summary>
      <p>CSV-Downloads enthalten alle Stützstellen ohne zusätzliche Rundung, mit Semikolon als Trennzeichen und Dezimalpunkt.</p>
      <p>Die ersten 50 Stützstellen je Verfahren. Die Diagramme enthalten alle berechneten Punkte.
        Die Fehler werden auch bei ausgeblendeter exakter Kurve gegen die analytische Lösung berechnet.</p>
      {data.results.map(({ method, data }) => <div className="table-scroll" key={method} tabIndex={0} role="region" aria-label={methodNames[method]}>
        <table><caption>{methodNames[method]} · Zeit in Sekunden, {label.name} und Fehler in {label.unit}</caption>
          <thead><tr><th scope="col">t</th><th scope="col">Numerisch</th><th scope="col">Exakt</th><th scope="col">Fehler</th></tr></thead>
          <tbody>{quantitySeries(data, quantity).slice(0, 50).map((point) => <tr key={point.t}>
            <td>{point.t.toFixed(2)}</td><td>{point.numerical.toPrecision(6)}</td>
            <td>{point.exact.toPrecision(6)}</td><td>{point.error.toExponential(3)}</td>
          </tr>)}</tbody>
        </table>
      </div>)}
    </details>
  </>;
}
