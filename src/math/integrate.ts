import type { IntegrationOptions, Solution, State } from './types';

export function assertVector(values: State, length = values.length): void {
  if (!length || values.length !== length || values.some(value => !Number.isFinite(value))) {
    throw new Error('Zustände und Ableitungen müssen gleich lange, endliche Zahlenvektoren sein.');
  }
}

/** Shared time grid; shorten the last step to reach the requested end exactly. */
export function integrate(initial: State, options: IntegrationOptions,
  step: (t: number, state: State, h: number) => State): Solution {
  const { startTime = 0, duration, stepSize } = options;
  if (![startTime, duration, stepSize].every(Number.isFinite) || duration < 0 || stepSize <= 0) {
    throw new Error('Dauer muss ≥ 0 und Schrittweite > 0 sein; alle Eingaben müssen endlich sein.');
  }
  const ratio = duration / stepSize;
  const nearest = Math.round(ratio);
  // Decimal inputs such as 0.07 / 0.01 can round just above an integer.
  const count = nearest > 0 && Math.abs(ratio - nearest) <= 8 * Number.EPSILON * Math.max(1, ratio)
    ? nearest : Math.ceil(ratio);
  if (count > 100_000 || !Number.isFinite(startTime + duration)) {
    throw new Error('Zu viele Schritte (maximal 100 000) oder ungültige Endzeit.');
  }
  assertVector(initial);
  const solution: Solution = [{ t: startTime, state: [...initial] }];
  for (let index = 1; index <= count; index++) {
    const previous = solution[solution.length - 1];
    const t = startTime + (index === count ? duration : Math.min(index * stepSize, duration));
    if (t <= previous.t) throw new Error('Schrittweite ist für diese Startzeit zu klein.');
    const state = step(previous.t, previous.state, t - previous.t);
    assertVector(state, initial.length);
    solution.push({ t, state: [...state] });
  }
  return solution;
}

export function addScaled(state: State, slope: State, scale: number): State {
  assertVector(slope, state.length);
  return state.map((value, index) => value + scale * slope[index]);
}
