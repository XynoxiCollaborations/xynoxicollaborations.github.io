import { methodNames } from '../../simulation/oscillator';
import { controlLimits, simulationDuration, type ComparisonParameters, type MethodSelection } from '../../simulation/comparison';
interface Props {
  parameters: ComparisonParameters;
  showExact: boolean;
  onChange: (parameters: ComparisonParameters) => void;
  onShowExact: (show: boolean) => void;
}
export default function SimulationControls({ parameters, showExact, onChange, onShowExact }: Props) {
  const update = (change: Partial<ComparisonParameters>) => onChange({ ...parameters, ...change });
  return <fieldset className="controls">
    <legend>Parameter</legend>
    <div className="control">
      <label htmlFor="method">Numerisches Verfahren</label>
      <select id="method" value={parameters.method} onChange={event => update({ method: event.target.value as MethodSelection })}>
        {Object.entries(methodNames).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
        <option value="all">Alle Verfahren</option>
      </select>
    </div>
    <div className="control">
      <label htmlFor="step-size">Schrittweite h <output htmlFor="step-size">{parameters.stepSize.toFixed(2)} s</output></label>
      <input id="step-size" type="range" {...controlLimits.stepSize} value={parameters.stepSize}
        aria-valuetext={`${parameters.stepSize.toFixed(2)} Sekunden`}
        onChange={event => update({ stepSize: Number(event.target.value) })} />
      <span className="range-bounds" aria-hidden="true"><span>0.01 s</span><span>0.50 s</span></span>
    </div>
    <div className="control">
      <label htmlFor="step-count">Schritte N <output htmlFor="step-count">{parameters.stepCount} (T = {simulationDuration(parameters).toFixed(2)} s)</output></label>
      <input id="step-count" type="range" {...controlLimits.stepCount} value={parameters.stepCount}
        aria-valuetext={`${parameters.stepCount} Schritte, Zeitintervall ${simulationDuration(parameters).toFixed(2)} Sekunden`}
        onChange={event => update({ stepCount: Number(event.target.value) })} />
      <span className="range-bounds" aria-hidden="true"><span>10 Schritte</span><span>1000 Schritte</span></span>
    </div>
    <div className="initial-values">
      <label htmlFor="initial-position">Anfangsposition (m)
        <input id="initial-position" type="number" min="-100" max="100" step="any" defaultValue={parameters.position}
          onChange={event => { if (event.target.value !== '' && event.target.validity.valid) update({ position: event.target.valueAsNumber }); }} />
      </label>
      <label htmlFor="initial-velocity">Anfangsgeschwindigkeit (m/s)
        <input id="initial-velocity" type="number" min="-100" max="100" step="any" defaultValue={parameters.velocity}
          onChange={event => { if (event.target.value !== '' && event.target.validity.valid) update({ velocity: event.target.valueAsNumber }); }} />
      </label>
    </div>
    <label className="exact-toggle"><input type="checkbox" checked={showExact} onChange={event => onShowExact(event.target.checked)} />
      Exakte Lösung einblenden</label>
    <p className="control-note">Änderungen werden sofort berechnet. Anfangswerte: −100 bis 100; leere oder ungültige Eingaben übernehmen wir erst nach Korrektur.</p>
  </fieldset>;
}
