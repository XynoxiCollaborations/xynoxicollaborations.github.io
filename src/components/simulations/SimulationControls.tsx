import { useState } from 'react';
import StepControls from './StepControls';
import { quantityLabels, type Quantity } from '../../simulation/quantities';
import { methodNames, type Method } from '../../simulation/oscillator';
import { type ComparisonParameters } from '../../simulation/comparison';
interface Props {
  quantity: Quantity;
  onQuantity: (quantity: Quantity) => void;
  parameters: ComparisonParameters;
  showExact: boolean;
  onChange: (parameters: ComparisonParameters) => void;
  onShowExact: (show: boolean) => void;
}
export default function SimulationControls({ parameters, showExact, onChange, onShowExact, quantity, onQuantity }: Props) {
  const [advanced, setAdvanced] = useState(false);
  const update = (change: Partial<ComparisonParameters>) => onChange({ ...parameters, ...change });
  return <fieldset className="controls">
    <legend>Parameter</legend>
    <StepControls parameters={parameters} advanced={advanced} onChange={update} />
    <label className="exact-toggle">
      <input type="checkbox" checked={advanced} aria-expanded={advanced} aria-controls="advanced-options"
        onChange={event => setAdvanced(event.target.checked)} />
      weitere Optionen
    </label>
    {advanced && <div id="advanced-options" className="advanced-options">
    <div className="control">
      <label htmlFor="quantity">Dargestellte Größe</label>
      <select id="quantity" value={quantity} onChange={event => onQuantity(event.target.value as Quantity)}>
        {Object.entries(quantityLabels).map(([value, label]) => <option key={value} value={value}>{label.name}</option>)}
      </select>
    </div>
    <fieldset className="method-options"><legend>Verfahren vergleichen</legend>
      {(Object.keys(methodNames) as Method[]).map(method => <label key={method} className="method-option">
        <input type="checkbox" checked={parameters.methods.includes(method)}
          onChange={event => update({ methods: event.target.checked
            ? [...parameters.methods, method] : parameters.methods.filter(value => value !== method) })} />
        <span className="method-swatch" style={{ background: `var(--method-${method})` }} aria-hidden="true" />
        {methodNames[method]}
      </label>)}
    </fieldset>
    <div className="initial-values">
      <label htmlFor="spring-constant">Federkonstante D (N/m)
        <input id="spring-constant" type="number" min={Number.MIN_VALUE} step="any" defaultValue={parameters.springConstant}
          onChange={event => { if (event.target.validity.valid && event.target.valueAsNumber > 0) update({ springConstant: event.target.valueAsNumber }); }} />
      </label>
      <label htmlFor="mass">Masse m (kg)
        <input id="mass" type="number" min={Number.MIN_VALUE} step="any" defaultValue={parameters.mass}
          onChange={event => { if (event.target.validity.valid && event.target.valueAsNumber > 0) update({ mass: event.target.valueAsNumber }); }} />
      </label>
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
    <p className="control-note">Änderungen werden sofort berechnet. D und m müssen größer als 0 sein. Anfangswerte: −100 bis 100; leere oder ungültige Eingaben übernehmen wir erst nach Korrektur.</p>
    </div>}
  </fieldset>;
}
