export type State = readonly number[];
export interface ODESystem {
  derivative(t: number, state: State): State;
}
/** q'' = a(t, q); acceleration must not depend on velocity. */
export interface MechanicalSystem {
  acceleration(t: number, position: State): State;
}
export interface MechanicalState {
  position: State;
  velocity: State;
}
export interface SolutionPoint { t: number; state: State }
/** Mechanical solutions store [q1, ..., qN, v1, ..., vN]. */
export type Solution = SolutionPoint[];
export interface IntegrationOptions {
  startTime?: number;
  duration: number;
  stepSize: number;
}
export type ODESolver = (system: ODESystem, initial: State, options: IntegrationOptions) => Solution;
export type MechanicalSolver = (system: MechanicalSystem, initial: MechanicalState, options: IntegrationOptions) => Solution;
