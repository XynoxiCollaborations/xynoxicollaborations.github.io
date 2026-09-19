import { useMemo, useState } from 'react';
import { compareOscillator, defaultComparison } from '../../simulation/comparison';
import SimulationControls from './SimulationControls';
import SolutionPlot from './SolutionPlot';
import ErrorPlot from './ErrorPlot';
import SimulationReadout from './SimulationReadout';
import './simulation.css';

export default function Simulation() {
  const [parameters, setParameters] = useState(defaultComparison);
  const [showExact, setShowExact] = useState(true);
  const result = useMemo(() => {
    try { return { data: compareOscillator(parameters), error: undefined }; }
    catch (error) { return { data: undefined, error: error instanceof Error ? error.message : 'Berechnung fehlgeschlagen.' }; }
  }, [parameters]);
  return <section className="simulation" aria-label="Interaktive Simulation">
    <SimulationControls parameters={parameters} onChange={setParameters} showExact={showExact} onShowExact={setShowExact} />
    <div className="simulation-results">
      {result.error && <p role="alert">{result.error}</p>}
      {result.data && <>
        <div className="lab-heading"><span>Harmonischer Oszillator</span><span className="live-indicator">Live</span></div>
        <SolutionPlot data={result.data} showExact={showExact} />
        <ErrorPlot data={result.data} />
        <SimulationReadout data={result.data} />
      </>}
    </div>
  </section>;
}
