/**
 * CLI Script: Full Pipeline Runner
 *
 * Runs the 8-stage QA automation pipeline for a given story.
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

if (stageArg) {
  const stage = parseInt(stageArg, 10) as StageId;
  orchestrator.runPipeline(stage, stage).catch((err) => {
    console.error('❌ Stage execution error:', err);
    process.exit(1);
  });
} else {
  orchestrator.runPipeline(1, 8).catch((err) => {
    console.error('❌ Pipeline execution error:', err);
    process.exit(1);
  });
}
