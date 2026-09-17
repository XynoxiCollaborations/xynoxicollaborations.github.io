import { addScaled, integrate } from '../integrate';
import type { ODESolver } from '../types';
/** Classical RK4 weights four slopes by 1, 2, 2, 1. */
export const rungeKutta4: ODESolver = (system, initial, options) =>
  integrate(initial, options, (t, state, h) => {
    const k1 = system.derivative(t, state);
    const k2 = system.derivative(t + h / 2, addScaled(state, k1, h / 2));
    const k3 = system.derivative(t + h / 2, addScaled(state, k2, h / 2));
    const k4 = system.derivative(t + h, addScaled(state, k3, h));
    return addScaled(addScaled(addScaled(addScaled(state, k1, h / 6), k2, h / 3), k3, h / 3), k4, h / 6);
  });
