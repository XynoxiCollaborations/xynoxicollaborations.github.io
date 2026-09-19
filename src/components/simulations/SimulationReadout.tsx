import type { ComparisonData } from '../../simulation/comparison';
import { methodNames } from '../../simulation/oscillator';

export default function SimulationReadout({ data }: { data: ComparisonData }) {
  return <>
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Fehlervergleich">
      <table><caption>Maximaler absoluter Positionsfehler an den Stützstellen</caption>
        <thead><tr><th scope="col">Verfahren</th><th scope="col">Fehler (m)</th></tr></thead>
        <tbody>{data.results.map(({ method, data }) => <tr key={method}>
          <th scope="row">{methodNames[method]}</th><td>{data.maxPositionError.toExponential(3)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <details className="result-details"><summary>Wertetabellen zu den Diagrammen</summary>
      <p>Die ersten 50 Stützstellen je Verfahren. Die Diagramme enthalten alle berechneten Punkte.
        Die Fehler werden auch bei ausgeblendeter exakter Kurve gegen die analytische Lösung berechnet.</p>
      {data.results.map(({ method, data }) => <div className="table-scroll" key={method} tabIndex={0} role="region" aria-label={methodNames[method]}>
        <table><caption>{methodNames[method]} · Zeit in Sekunden, Position und Fehler in Metern</caption>
          <thead><tr><th scope="col">t</th><th scope="col">Numerisch</th><th scope="col">Exakt</th><th scope="col">Fehler</th></tr></thead>
          <tbody>{data.numerical.slice(0, 50).map((point, index) => <tr key={point.t}>
            <td>{point.t.toFixed(2)}</td><td>{point.state[0].toPrecision(6)}</td>
            <td>{data.exact[index].state[0].toPrecision(6)}</td><td>{data.positionError[index].error.toExponential(3)}</td>
          </tr>)}</tbody>
        </table>
      </div>)}
    </details>
  </>;
}
