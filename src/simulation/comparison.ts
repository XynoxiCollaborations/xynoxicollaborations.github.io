import { methodNames, simulateOscillator, type Method, type SimulationData } from './oscillator';

export type MethodSelection = Method | 'all';
export interface ComparisonParameters {
  method: MethodSelection;
  stepSize: number;
  stepCount: number;
  position: number;
  velocity: number;
}
export interface MethodResult { method: Method; data: SimulationData }
export interface ComparisonData { duration: number; results: MethodResult[] }
export const controlLimits = {
  stepSize: { min: 0.01, max: 0.5, step: 0.01 },
  stepCount: { min: 10, max: 1000, step: 1 },
} as const;
export const defaultComparison: ComparisonParameters = {
  method: 'all', stepSize: 0.1, stepCount: 200, position: 1, velocity: 0,
};
export function simulationDuration(parameters: Pick<ComparisonParameters, 'stepSize' | 'stepCount'>): number {
  return parameters.stepSize * parameters.stepCount;
}
/** The UI specifies N full steps; all methods share the same time interval. */
export function compareOscillator(parameters: ComparisonParameters): ComparisonData {
  const { stepCount, stepSize } = parameters;
  if (!Number.isInteger(stepCount) || stepCount < 1 || stepCount > 100_000) {
    throw new Error('Die Schrittzahl N muss eine natürliche Zahl von 1 bis 100 000 sein.');
  }
  const duration = simulationDuration(parameters);
  const methods = parameters.method === 'all' ? Object.keys(methodNames) as Method[] : [parameters.method];
  const results = methods.map(method => ({ method, data: simulateOscillator({ ...parameters, method, stepSize, duration }) }));
  return { duration, results };
}
