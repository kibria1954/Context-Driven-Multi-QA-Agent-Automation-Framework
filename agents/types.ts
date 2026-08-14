/**
 * Shared types for the pipeline orchestrator (gate tracker).
 *
 * Stage numbering matches the skill directories in `.agents/skills/00-...` through `09-...`
 * and the 9-stage table in README.md (Stage 1-9), with Stage 0 covering Agent 0
 * (Test Data & Environment) ahead of it.
 */

export type StageId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type StageStatus = 'not_started' | 'complete' | 'stale';

export interface StageResult {
  stageId: StageId;
  name: string;
  status: StageStatus;
  detail: string;
}

export interface GateCheck {
  canRun: boolean;
  reason?: string;
}

export interface StageDefinition {
  id: StageId;
  name: string;
  skillDir: string;
  /** Returns the artifact path(s) this stage is expected to produce for a given feature. */
  artifacts: (feature: string) => string[];
  /** True if this stage may perform state-changing (write) actions against a live environment. */
  requiresWriteSafety: boolean;
}
