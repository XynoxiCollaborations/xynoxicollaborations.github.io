import type { SimulationData } from './oscillator';

export const quantityLabels = {
  position: { name: 'Position', unit: 'm', title: 'Position im Zeitverlauf', axis: 'Position x (m)', error: 'Positionsfehler' },
  energy: { name: 'Gesamtenergie', unit: 'J', title: 'Gesamtenergie im Zeitverlauf', axis: 'Gesamtenergie E (J)', error: 'Energiefehler' },
} as const;
export type Quantity = keyof typeof quantityLabels;

/** Shared display data for charts and accessible tables; no solver depends on the view. */
export function quantitySeries(data: SimulationData, quantity: Quantity) {
  if (quantity === 'energy') return data.energy;
  return data.numerical.map((point, index) => ({
    t: point.t, numerical: point.state[0], exact: data.exact[index].state[0],
    error: data.positionError[index].error,
  }));
}

export function maximumQuantityError(data: SimulationData, quantity: Quantity): number {
  return quantitySeries(data, quantity).reduce((max, point) => Math.max(max, point.error), 0);
}
