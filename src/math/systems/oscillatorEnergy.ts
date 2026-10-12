/** Mechanical energy of an undamped spring oscillator, measured from equilibrium. */
export function oscillatorEnergy(position: number, velocity: number, springConstant: number, mass: number): number {
  return 0.5 * springConstant * position ** 2 + 0.5 * mass * velocity ** 2;
}
