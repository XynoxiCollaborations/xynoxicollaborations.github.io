import { methodNames, type Method, type SimulationParameters } from '../../simulation/oscillator';
interface Props { parameters: SimulationParameters; onRun: (parameters: SimulationParameters) => void }
export default function SimulationControls({ parameters, onRun }: Props) {
  return <form onSubmit={event => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    onRun({ method: values.get('method') as Method,
      stepSize: Number(values.get('stepSize')), duration: Number(values.get('duration')),
      position: Number(values.get('position')), velocity: Number(values.get('velocity')) });
  }}>
    <fieldset className="controls"><legend>Simulation einstellen</legend>
      <label>Verfahren<select name="method" defaultValue={parameters.method}>
        {Object.entries(methodNames).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
      </select></label>
      <label>Schrittweite h (s)<input name="stepSize" type="number" min="0.001" max="2" step="any" required defaultValue={parameters.stepSize} /></label>
      <label>Dauer (s)<input name="duration" type="number" min="0.01" max="100" step="any" required defaultValue={parameters.duration} /></label>
      <label>Anfangsposition (m)<input name="position" type="number" min="-100" max="100" step="any" required defaultValue={parameters.position} /></label>
      <label>Anfangsgeschwindigkeit (m/s)<input name="velocity" type="number" min="-100" max="100" step="any" required defaultValue={parameters.velocity} /></label>
      <button type="submit">Simulation berechnen</button>
    </fieldset>
  </form>;
}
