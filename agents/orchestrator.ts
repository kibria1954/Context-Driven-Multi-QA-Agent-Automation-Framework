/**
 * Orchestrator — Pipeline Gate Tracker
 *
 * This does NOT run agent reasoning itself (writing test cases, exploring pages,
 * generating code). That work is done by an AI agent (Claude) following
 * the matching `.agents/skills/<stage>/SKILL.md` file for the given stage, driven per feature.
 *
 * What this DOES do:
 *   - Know which artifact each stage is expected to produce, and whether it exists.
 *   - Refuse to mark a stage "ready" until its predecessor's artifact exists.
 *   - Enforce the write-safety hard stop (envs/{env}.md `Write-Safe:` flag) for
 *     stages that perform state-changing actions against a live environment.
 *   - Refuse to mark a stage "ready" while a blocking question is open for the feature.
 *   - Detect requirement drift (SHA-256 mismatch) so stale downstream stages are visible.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { isWriteSafe } from '../utils/env';
import { hasOpenQuestions } from '../utils/escalation-helpers';
import type { StageId, StageStatus, StageResult, GateCheck, StageDefinition } from './types';

const ROOT = path.resolve(__dirname, '..');

function fileExists(p: string): boolean {
  return fs.existsSync(path.join(ROOT, p));
}

function findSpecFile(feature: string): string | undefined {
  const specDir = path.join(ROOT, 'tests', 'e2e');
  if (!fs.existsSync(specDir)) return undefined;

  const stack = [specDir];
  while (stack.length) {
    const dir = stack.pop() as string;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        stack.push(full);
      } else if (entry === `${feature}.spec.ts`) {
        return path.relative(ROOT, full);
      }
    }
  }
  return undefined;
}

// ─── Stage Definitions ────────────────────────────────────────────────────────

export const STAGE_DEFINITIONS: StageDefinition[] = [
  {
    id: 0,
    name: 'Test Data & Environment',
    skillDir: '00-testdata-environment',
    artifacts: (f) => [`testdata/${f}/seed.json`],
    requiresWriteSafety: false,
    dependsOn: [],
  },
  {
    id: 1,
    name: 'Context Ingestion',
    skillDir: '01-context-ingestion',
    artifacts: (f) => [`requirements/${f}/parsed.json`],
    requiresWriteSafety: false,
    // No dependency on Stage 0 — this is pure text processing, no live environment involved.
    dependsOn: [],
  },
  {
    id: 2,
    name: 'Test Case Design',
    skillDir: '02-testcase-design',
    artifacts: (f) => [`testcases/${f}.tc.json`],
    requiresWriteSafety: false,
    dependsOn: [1],
  },
  {
    id: 3,
    name: 'Workflow Design',
    skillDir: '03-workflow-design',
    artifacts: (f) => [`workflows/${f}.journey.json`],
    requiresWriteSafety: false,
    dependsOn: [2],
  },
  {
    id: 4,
    name: 'Live Site Verification',
    skillDir: '04-live-explorer',
    artifacts: (f) => [`workflows/${f}.verify.json`],
    requiresWriteSafety: true,
    // Needs the provisioned data from Stage 0 as well as the planned journey from Stage 3.
    dependsOn: [3, 0],
  },
  {
    id: 5,
    name: 'POM Code Generation',
    skillDir: '05-codegen-pom',
    // Location varies by feature (tests/e2e/{domain}/{feature}.spec.ts) — resolved via findSpecFile.
    artifacts: () => [],
    requiresWriteSafety: false,
    dependsOn: [4],
  },
  {
    id: 6,
    name: 'Coverage Validation',
    skillDir: '06-coverage-validation',
    artifacts: (f) => [`memory/traceability/${f}.md`],
    requiresWriteSafety: false,
    dependsOn: [5],
  },
  {
    id: 7,
    name: 'Execution + Self-Heal',
    skillDir: '07-execution-self-heal',
    // Playwright's JSON reporter output is shared across all features run in the same
    // invocation — this is a best-effort, repo-wide signal, not a strict per-feature one.
    artifacts: () => ['reports/generated/test-results.json'],
    requiresWriteSafety: true,
    dependsOn: [6, 0],
  },
  {
    id: 8,
    name: 'Custom Report',
    skillDir: '08-report-generation',
    artifacts: (f) => [`reports/generated/${f}-report.html`],
    requiresWriteSafety: false,
    dependsOn: [7],
  },
  {
    id: 9,
    name: 'Learning & Memory',
    skillDir: '09-learning-prevention',
    // Pattern store is global, not per-feature.
    artifacts: () => ['memory/healed-patterns.json'],
    requiresWriteSafety: false,
    dependsOn: [8],
  },
];

function getDefinition(stageId: StageId): StageDefinition {
  const def = STAGE_DEFINITIONS.find((d) => d.id === stageId);
  if (!def) throw new Error(`Unknown stage: ${stageId}`);
  return def;
}

// ─── Orchestrator ──────────────────────────────────────────────────────────────

export class Orchestrator {
  constructor(
    private readonly feature: string,
    private readonly dryRun: boolean = false
  ) {}

  /** Requirement drift: does requirements/{feature}/source.md still match the hash on file? */
  private requirementIsStale(): boolean {
    const sourceFile = path.join(ROOT, 'requirements', this.feature, 'source.md');
    const metaFile = path.join(ROOT, 'requirements', this.feature, 'source.meta.json');
    if (!fs.existsSync(sourceFile) || !fs.existsSync(metaFile)) return false;

    try {
      const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
      const currentHash = crypto.createHash('sha256').update(fs.readFileSync(sourceFile, 'utf-8')).digest('hex');
      return meta.sha256 !== currentHash;
    } catch {
      return false;
    }
  }

  getStageStatus(stageId: StageId): StageResult {
    const def = getDefinition(stageId);

    // Stage 5 (codegen) resolves its artifact dynamically since path varies by feature.
    if (stageId === 5) {
      const spec = findSpecFile(this.feature);
      return {
        stageId,
        name: def.name,
        status: spec ? 'complete' : 'not_started',
        detail: spec ? `Found ${spec}` : `No tests/e2e/**/${this.feature}.spec.ts found`,
      };
    }

    const artifacts = def.artifacts(this.feature);
    const missing = artifacts.filter((a) => !fileExists(a));

    if (missing.length > 0) {
      return {
        stageId,
        name: def.name,
        status: 'not_started',
        detail: `Missing: ${missing.join(', ')}`,
      };
    }

    if (stageId === 1 && this.requirementIsStale()) {
      return {
        stageId,
        name: def.name,
        status: 'stale',
        detail: 'requirements/{feature}/source.md hash no longer matches source.meta.json — re-ingest needed',
      };
    }

    return { stageId, name: def.name, status: 'complete', detail: `Found ${artifacts.join(', ')}` };
  }

  canRunStage(stageId: StageId): GateCheck {
    if (hasOpenQuestions(this.feature)) {
      return { canRun: false, reason: `Blocking question(s) open for "${this.feature}" in memory/pending-questions.md` };
    }

    const def = getDefinition(stageId);

    if (def.requiresWriteSafety) {
      const envName = process.env.ENV || 'staging';
      if (!isWriteSafe(envName)) {
        return {
          canRun: false,
          reason: `Stage ${stageId} (${def.name}) performs write actions but env "${envName}" is not marked write-safe in envs/${envName}.md`,
        };
      }
    }

    for (const depId of def.dependsOn) {
      const depStatus = this.getStageStatus(depId);
      if (depStatus.status !== 'complete') {
        return {
          canRun: false,
          reason: `Stage ${depId} (${depStatus.name}) is "${depStatus.status}" — ${depStatus.detail}`,
        };
      }
    }

    return { canRun: true };
  }

  /** Prints a status table for the given stage range. Does not execute any stage's work. */
  async runPipeline(from: StageId, to: StageId): Promise<void> {
    console.log(`\n🧭 Orchestrator — feature: "${this.feature}"${this.dryRun ? ' (dry-run)' : ''}\n`);

    for (let s = from; s <= to; s++) {
      const stageId = s as StageId;
      const status = this.getStageStatus(stageId);
      const gate = this.canRunStage(stageId);

      const icon = status.status === 'complete' ? '✅' : status.status === 'stale' ? '♻️' : gate.canRun ? '🟢' : '🔴';
      const gateLabel =
        status.status === 'complete'
          ? 'ALREADY COMPLETE'
          : status.status === 'stale'
            ? 'STALE — needs re-run'
            : gate.canRun
              ? 'READY'
              : `BLOCKED — ${gate.reason}`;

      console.log(`${icon} Stage ${stageId} — ${status.name} [${gateLabel}]`);
      console.log(`   .agents/skills/${getDefinition(stageId).skillDir}/SKILL.md`);
      console.log(`   ${status.detail}\n`);
    }
  }
}
