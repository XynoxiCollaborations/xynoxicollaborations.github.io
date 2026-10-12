import { advancedControlLimits, controlLimits, simulationDuration, type ComparisonParameters } from '../../simulation/comparison';

interface Props {
  parameters: ComparisonParameters;
  advanced: boolean;
  onChange: (change: Partial<ComparisonParameters>) => void;
}

export default function StepControls({ parameters, advanced, onChange }: Props) {
  // Extend sliders when necessary so switching modes never clamps a manual value.
  const hMin = Math.min(controlLimits.stepSize.min, parameters.stepSize);
  const hMax = Math.max(controlLimits.stepSize.max, parameters.stepSize);
  const nMax = Math.max(controlLimits.stepCount.max, parameters.stepCount);
  return <>
    <div className="control">
      <label htmlFor="step-size">Schrittweite h <output htmlFor="step-size">{parameters.stepSize} s</output></label>
      {advanced ? <input key="manual-h" id="step-size" type="number"
        {...advancedControlLimits.stepSize}
        defaultValue={parameters.stepSize} aria-describedby="step-input-note"
        onChange={event => {
          if (event.target.value !== '' && event.target.validity.valid) onChange({ stepSize: event.target.valueAsNumber });
        }} /> : <input key="slider-h" id="step-size" type="range" {...controlLimits.stepSize}
        min={hMin} max={hMax} step={advancedControlLimits.stepSize.step}
        value={parameters.stepSize} aria-valuetext={`${parameters.stepSize} Sekunden`}
        onChange={event => onChange({ stepSize: Number(event.target.value) })} />}
      {!advanced && <span className="range-bounds" aria-hidden="true"><span>{hMin} s</span><span>{hMax} s</span></span>}
    </div>
    <div className="control">
      <label htmlFor="step-count">Schritte N <output htmlFor="step-count">{parameters.stepCount} (T = {simulationDuration(parameters).toFixed(2)} s)</output></label>
      {advanced ? <input key="manual-n" id="step-count" type="number" {...advancedControlLimits.stepCount}
        defaultValue={parameters.stepCount} aria-describedby="step-input-note"
        onChange={event => {
          if (event.target.value !== '' && event.target.validity.valid) onChange({ stepCount: event.target.valueAsNumber });
        }} /> : <input key="slider-n" id="step-count" type="range" {...controlLimits.stepCount} value={parameters.stepCount}
        max={nMax}
        aria-valuetext={`${parameters.stepCount} Schritte, Zeitintervall ${simulationDuration(parameters).toFixed(2)} Sekunden`}
        onChange={event => onChange({ stepCount: Number(event.target.value) })} />}
      {!advanced && <span className="range-bounds" aria-hidden="true"><span>10 Schritte</span><span>{nMax} Schritte</span></span>}
    </div>
    {advanced && <p id="step-input-note" className="control-note">
      h: 0.001–5 s in Schritten von 0.001 s; N: 10–100000 ganze Schritte. Gültige Eingaben werden sofort übernommen.
      Bei leeren oder ungültigen Feldern bleibt die letzte gültige Berechnung sichtbar.
    </p>}
  </>;
}
