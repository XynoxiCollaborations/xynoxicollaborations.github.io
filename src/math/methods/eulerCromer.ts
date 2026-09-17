import { addScaled, integrate } from '../integrate';
import { pack } from '../mechanics';
import type { MechanicalSolver } from '../types';
/** Kick then drift: update velocity first, then position with the new velocity. */
export const eulerCromer: MechanicalSolver = (system, initial, options) =>
  integrate(pack(initial), options, (t, state, h) => {
    const n = initial.position.length;
    const position = state.slice(0, n);
    const velocity = addScaled(state.slice(n), system.acceleration(t, position), h);
    return [...addScaled(position, velocity, h), ...velocity];
  });
