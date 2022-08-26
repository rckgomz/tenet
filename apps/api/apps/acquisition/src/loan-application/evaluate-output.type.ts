export type EvaluateOutputType = {
  approved: boolean;
  reason: { type: string; params?: Record<string, any> }[];
  rawOutcome: Record<string, any>;
};
