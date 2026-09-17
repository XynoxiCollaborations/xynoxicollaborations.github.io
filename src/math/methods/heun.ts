import { addScaled, integrate } from '../integrate';
import type { ODESolver } from '../types';
/** Heun averages the initial slope and the Euler predictor's slope. */
export const heun: ODESolver = (system, initial, options) =>
  integrate(initial, options, (t, state, h) => {
    const first = system.derivative(t, state);
    const predicted = addScaled(state, first, h);
    const second = system.derivative(t + h, predicted);
    return addScaled(addScaled(state, first, h / 2), second, h / 2);
  });
