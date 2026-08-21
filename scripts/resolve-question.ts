/**
 * resolve-question.ts — CLI entry point for resolvePendingQuestion() (GAP-005)
 *
 * Marks a question in memory/pending-questions.md as answered AND records the
 * answer in memory/decisions.md in one step, via utils/escalation-helpers.ts.
 * This is the mechanism AGENTS.md rule 12 and Section "Owner Escalation &
 * Governance" refer to — use this instead of hand-editing decisions.md, so the
 * two files can never drift apart again the way decisions.md went empty before.
 *
 * Usage:
 *   npx ts-node scripts/resolve-question.ts --id=Q-1755... --answer="The answer text" \
 *     [--by=owner] [--applied-to=b2b-registration,wholesale-checkout]
 */
import { resolvePendingQuestion } from '../utils/escalation-helpers';

const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

const id = getArg('id');
const answer = getArg('answer');
const answeredBy = getArg('by') ?? 'owner';
const appliedTo = getArg('applied-to')?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];

if (!id || !answer) {
  console.error(
    '❌ Usage: npx ts-node scripts/resolve-question.ts --id=Q-... --answer="..." [--by=owner] [--applied-to=feature1,feature2]'
  );
  process.exit(1);
}

try {
  resolvePendingQuestion(id, answer, answeredBy, appliedTo);
  console.log(`✅ ${id} marked ANSWERED in memory/pending-questions.md and recorded in memory/decisions.md.`);
} catch (error) {
  console.error(`❌ ${(error as Error).message}`);
  process.exit(1);
}
