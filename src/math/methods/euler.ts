import { addScaled, integrate } from '../integrate';
import type { ODESolver } from '../types';
/** Explicit Euler uses the slope at the beginning of each step. */
export const euler: ODESolver = (system, initial, options) =>
  integrate(initial, options, (t, state, h) => addScaled(state, system.derivative(t, state), h));
