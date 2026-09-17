import type { MechanicalSystem } from '../types';
export function harmonicOscillator(springConstant = 1, mass = 1): MechanicalSystem {
  if (![springConstant, mass].every(value => Number.isFinite(value) && value > 0)) {
    throw new Error('Federkonstante und Masse müssen positiv und endlich sein.');
  }
  return { acceleration: (_t, position) => position.map(x => -springConstant / mass * x) };
}
