import { useMemo, useState } from 'react';
import { defaultParameters, methodNames, simulateOscillator } from '../../simulation/oscillator';
import SimulationControls from './SimulationControls';
import SolutionPlot from './SolutionPlot';
import ErrorPlot from './ErrorPlot';
import './simulation.css';
export default function Simulation() {
  const [parameters, setParameters] = useState(defaultParameters);
  const result = useMemo(() => {
    try { return { data: simulateOscillator(parameters), error: undefined }; }
    catch (error) { return { data: undefined, error: error instanceof Error ? error.message : 'Berechnung fehlgeschlagen.' }; }
  }, [parameters]);
  return <section aria-label="Interaktive Simulation">
    <SimulationControls parameters={parameters} onRun={setParameters} />
    {result.error && <p role="alert">{result.error}</p>}
    {result.data && <>
      <p role="status">{methodNames[parameters.method]} · {result.data.numerical.length - 1} Schritte ·
        maximaler Positionsfehler an den Stützstellen: {result.data.maxPositionError.toExponential(3)} m</p>
      <SolutionPlot data={result.data} /><ErrorPlot data={result.data} />
      <details><summary>Wertetabelle zu den Diagrammen</summary>
        <p>Die ersten 200 Stützstellen; die Diagramme enthalten alle berechneten Punkte.</p>
        <div className="table-scroll"><table><caption>Position und Fehler in Metern, Zeit in Sekunden</caption>
          <thead><tr><th scope="col">t</th><th scope="col">Numerisch</th><th scope="col">Exakt</th><th scope="col">Fehler</th></tr></thead>
          <tbody>{result.data.numerical.slice(0, 200).map((point, index) => <tr key={point.t}>
            <td>{point.t.toFixed(3)}</td><td>{point.state[0].toPrecision(6)}</td>
            <td>{result.data.exact[index].state[0].toPrecision(6)}</td><td>{result.data.positionError[index].error.toExponential(3)}</td>
          </tr>)}</tbody></table></div>
      </details>
    </>}
  </section>;
}
