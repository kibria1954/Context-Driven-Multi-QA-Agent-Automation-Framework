/**
 * Escalation Helpers — Owner Question & Decision Management
 *
 * Manages the pending-questions.md and decisions.md files for the
 * human-in-the-loop escalation system. When any agent encounters
 * ambiguity, low confidence, or unsafe conditions, it uses these
 * helpers to formally escalate to the owner.
 *
 * Flow: Question → pending-questions.md → Owner answers → decisions.md
 */
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PendingQuestion {
  id: string;
  timestamp: string;
  agentId: string;
  feature: string;
  question: string;
  context: string;
  suggestedOptions?: string[];
  priority: 'blocking' | 'important' | 'informational';
  status: 'open' | 'answered' | 'deferred';
}

export interface Decision {
  questionId: string;
  answeredAt: string;
  answeredBy: string;
  answer: string;
  appliedTo: string[];
}

// ─── Paths ───────────────────────────────────────────────────────────────────

const MEMORY_DIR = path.resolve(process.cwd(), 'memory');
const PENDING_FILE = path.join(MEMORY_DIR, 'pending-questions.md');
const DECISIONS_FILE = path.join(MEMORY_DIR, 'decisions.md');

// ─── Helper Functions ────────────────────────────────────────────────────────

function ensureFile(filePath: string, header: string): void {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, header, 'utf-8');
  }
}

function generateQuestionId(): string {
  return `Q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

// ─── Escalation Functions ────────────────────────────────────────────────────

/**
 * Escalate a question to the owner. Appends to pending-questions.md.
 * Returns the generated question ID.
 */
export function escalateToOwner(
  agentId: string,
  feature: string,
  question: string,
  context: string,
  priority: PendingQuestion['priority'] = 'blocking',
  suggestedOptions?: string[]
): string {
  ensureFile(PENDING_FILE, '# 🔴 Pending Questions — Owner Dashboard\n\n> Questions from agents that need human answers before the pipeline can continue.\n\n---\n\n');

  const id = generateQuestionId();
  const timestamp = new Date().toISOString();

  let entry = `\n## ${id} — ${priority.toUpperCase()} (${agentId})\n\n`;
  entry += `- **Timestamp:** \`${timestamp}\`\n`;
  entry += `- **Agent:** ${agentId}\n`;
  entry += `- **Feature:** ${feature}\n`;
  entry += `- **Priority:** ${priority}\n`;
  entry += `- **Status:** 🔴 OPEN\n\n`;
  entry += `**Question:**\n${question}\n\n`;
  entry += `**Context:**\n${context}\n\n`;

  if (suggestedOptions && suggestedOptions.length > 0) {
    entry += `**Suggested Options:**\n`;
    suggestedOptions.forEach((opt, i) => {
      entry += `${i + 1}. ${opt}\n`;
    });
    entry += '\n';
  }

  entry += `---\n`;

  fs.appendFileSync(PENDING_FILE, entry, 'utf-8');

  console.log(`\n❓ ESCALATION [${id}]: ${question.substring(0, 80)}...`);
  console.log(`   Agent: ${agentId} | Feature: ${feature} | Priority: ${priority}`);
  console.log(`   → Added to memory/pending-questions.md\n`);

  return id;
}

/**
 * Record a decision (answer to a previously escalated question).
 * Appends to decisions.md.
 */
export function recordDecision(
  questionId: string,
  answer: string,
  answeredBy = 'owner',
  appliedTo: string[] = []
): void {
  ensureFile(DECISIONS_FILE, '# 📋 Decisions Log — Owner Answers\n\n> Append-only log of all owner decisions. Agents reference this to avoid re-asking the same question.\n\n---\n\n');

  const timestamp = new Date().toISOString();

  let entry = `\n## Decision: ${questionId}\n\n`;
  entry += `- **Answered At:** \`${timestamp}\`\n`;
  entry += `- **Answered By:** ${answeredBy}\n`;
  entry += `- **Applied To:** ${appliedTo.length > 0 ? appliedTo.join(', ') : 'pending'}\n\n`;
  entry += `**Answer:**\n${answer}\n\n`;
  entry += `---\n`;

  fs.appendFileSync(DECISIONS_FILE, entry, 'utf-8');

  console.log(`✅ Decision recorded for ${questionId}: ${answer.substring(0, 60)}...`);
}

// Entries are written as "- **Status:** 🔴 OPEN\n" (see escalateToOwner below) — the
// literal `**` markdown bold markers sit right after "Status:", before the space and
// emoji. A pattern of `Status:\s*🔴` (no `\**`) never matches that "**" and silently
// always returns zero matches — which is exactly what `hasOpenQuestions()` /
// `countOpenQuestions()` did before this fix, permanently disabling the orchestrator's
// blocking-question gate (`agents/orchestrator.ts`'s `canRunStage()` calls
// `hasOpenQuestions(this.feature)` and would always get `false` back, gate or no gate).
const OPEN_STATUS_PATTERN = /Status:\**\s*🔴\s*OPEN/gi;

/**
 * Check if there are any open (unanswered) pending questions for a feature.
 */
export function hasOpenQuestions(feature?: string): boolean {
  if (!fs.existsSync(PENDING_FILE)) return false;

  const content = fs.readFileSync(PENDING_FILE, 'utf-8');
  const matches = content.match(OPEN_STATUS_PATTERN);

  if (!matches) return false;
  if (!feature) return matches.length > 0;

  // Check if any open question is for this feature. Entries are written as
  // "- **Feature:** {feature}\n" (see escalateToOwner below) — the literal `**`
  // markdown bold markers sit between "Feature:" and the value, so a pattern of
  // `Feature:\s*{feature}` never matched anything and this always returned false
  // for a feature-scoped check, silently disabling the orchestrator's per-feature
  // blocking-question gate (agents/orchestrator.ts calls hasOpenQuestions(this.feature)).
  // `\**` makes those optional asterisks part of the match instead of breaking it.
  const escapedFeature = feature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const featurePattern = new RegExp(`Feature:\\**\\s*${escapedFeature}\\b[\\s\\S]*?Status:\\**\\s*🔴\\s*OPEN`, 'gi');
  return featurePattern.test(content);
}

/**
 * Count open questions.
 */
export function countOpenQuestions(): number {
  if (!fs.existsSync(PENDING_FILE)) return 0;

  const content = fs.readFileSync(PENDING_FILE, 'utf-8');
  const matches = content.match(OPEN_STATUS_PATTERN);
  return matches ? matches.length : 0;
}

/**
 * Resolve a pending question: flips its status marker in pending-questions.md from
 * 🔴 OPEN to ✅ ANSWERED, then calls recordDecision() to append the answer to
 * decisions.md.
 *
 * GAP-005 fix: `recordDecision()` existed but nothing ever called it — an owner's
 * answer only ever made it into decisions.md if someone hand-typed a D-NNN entry,
 * which is exactly how the file went empty for weeks despite real questions being
 * answered in chat. This is the ONE function agents should call after an owner
 * answers a question from `memory/pending-questions.md` — it keeps both files in
 * sync instead of requiring a separate manual edit to each. See
 * `scripts/resolve-question.ts` for the CLI entry point.
 *
 * Throws if `questionId` isn't found as an OPEN question in pending-questions.md —
 * this is deliberate: silently recording a decision with no matching open question
 * would let decisions.md and pending-questions.md drift apart again.
 */
export function resolvePendingQuestion(
  questionId: string,
  answer: string,
  answeredBy = 'owner',
  appliedTo: string[] = []
): void {
  if (!fs.existsSync(PENDING_FILE)) {
    throw new Error(`Cannot resolve ${questionId} — memory/pending-questions.md does not exist.`);
  }

  const content = fs.readFileSync(PENDING_FILE, 'utf-8');
  const blockRe = new RegExp(`(## ${questionId}[\\s\\S]*?- \\*\\*Status:\\*\\*\\s*)🔴\\s*OPEN`, 'i');

  if (!blockRe.test(content)) {
    throw new Error(
      `Cannot resolve ${questionId} — no OPEN question with that ID found in memory/pending-questions.md ` +
      `(already resolved, or the ID is wrong).`
    );
  }

  const updated = content.replace(blockRe, `$1✅ ANSWERED`);
  fs.writeFileSync(PENDING_FILE, updated, 'utf-8');

  recordDecision(questionId, answer, answeredBy, appliedTo);
}
