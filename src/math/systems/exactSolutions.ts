import { harmonicOscillator } from './harmonicOscillator';
import type { State } from '../types';
/** Exact 1D oscillator state [x, v], with initial conditions given at startTime. */
export function exactOscillator(t: number, position: number, velocity: number,
  springConstant = 1, mass = 1, startTime = 0): State {
  harmonicOscillator(springConstant, mass); // share physical parameter validation
  const omega = Math.sqrt(springConstant / mass);
  const phase = omega * (t - startTime);
  return [position * Math.cos(phase) + velocity / omega * Math.sin(phase),
    -position * omega * Math.sin(phase) + velocity * Math.cos(phase)];
}
