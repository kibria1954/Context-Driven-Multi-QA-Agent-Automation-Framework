/**
 * CLI Script: Pipeline Gate-Status Checker
 *
 * Reports readiness (READY / BLOCKED / ALREADY COMPLETE / STALE) for each of the
 * 10 pipeline stages (0-9, matching .agents/skills/00-...09-...) for a given story.
 * This does NOT execute agent reasoning itself — that's done by an AI agent
 * following the corresponding SKILL.md. It only enforces stage order, write-safety,
 * and open-question gates so you know what's safe to run next.
 *
 * Usage:
 *   npx ts-node scripts/run-pipeline.ts --story=login-feature
 *   npx ts-node scripts/run-pipeline.ts --story=login-feature --stage=2
 *   npx ts-node scripts/run-pipeline.ts --story=login-feature --dry-run
 */
import { Orchestrator } from '../agents/orchestrator';
import type { StageId } from '../agents/types';

const args = process.argv.slice(2);
const storyArg = args.find((a) => a.startsWith('--story='))?.split('=')[1];
const stageArg = args.find((a) => a.startsWith('--stage='))?.split('=')[1];
const dryRun = args.includes('--dry-run');

if (!storyArg) {
  console.error('❌ Missing required parameter: --story=<story-name>');
  console.error('Example: npx ts-node scripts/run-pipeline.ts --story=login-feature');
  process.exit(1);
}

const orchestrator = new Orchestrator(storyArg, dryRun);

function fail(context: string, err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`❌ ${context}:`, message);
  process.exit(1);
}

if (stageArg) {
  const stage = parseInt(stageArg, 10) as StageId;
  orchestrator.runPipeline(stage, stage).catch((err: unknown) => fail('Stage execution error', err));
} else {
  orchestrator.runPipeline(0, 9).catch((err: unknown) => fail('Pipeline execution error', err));
}
