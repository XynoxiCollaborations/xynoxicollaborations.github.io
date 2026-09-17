import { assertVector } from './integrate';
import type { MechanicalState, MechanicalSystem, ODESystem, State } from './types';
export function pack(initial: MechanicalState): State {
  assertVector(initial.position);
  assertVector(initial.velocity, initial.position.length);
  return [...initial.position, ...initial.velocity];
}
export function asFirstOrder(system: MechanicalSystem, dimensions: number): ODESystem {
  return { derivative(t, state) {
    assertVector(state, dimensions * 2);
    const acceleration = system.acceleration(t, state.slice(0, dimensions));
    assertVector(acceleration, dimensions);
    return [...state.slice(dimensions), ...acceleration];
  } };
}
