import { addScaled, integrate } from '../integrate';
import { pack } from '../mechanics';
import type { MechanicalSolver } from '../types';
/** Kick-drift-kick leapfrog (velocity Verlet). Output velocities are at full times,
 * while the internal drift uses a half-step velocity. Requires a(t, q), not a(t, q, v).
 */
export const leapfrog: MechanicalSolver = (system, initial, options) =>
  integrate(pack(initial), options, (t, state, h) => {
    const n = initial.position.length;
    const position = state.slice(0, n);
    const halfVelocity = addScaled(state.slice(n), system.acceleration(t, position), h / 2);
    const nextPosition = addScaled(position, halfVelocity, h);
    const velocity = addScaled(halfVelocity, system.acceleration(t + h, nextPosition), h / 2);
    return [...nextPosition, ...velocity];
  });
