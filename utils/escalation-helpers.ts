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

/**
 * Check if there are any open (unanswered) pending questions for a feature.
 */
export function hasOpenQuestions(feature?: string): boolean {
  if (!fs.existsSync(PENDING_FILE)) return false;

  const content = fs.readFileSync(PENDING_FILE, 'utf-8');
  const openPattern = /Status:\s*🔴\s*OPEN/gi;
  const matches = content.match(openPattern);

  if (!matches) return false;
  if (!feature) return matches.length > 0;

  // Check if any open question is for this feature
  const featurePattern = new RegExp(`Feature:\\s*${feature}[\\s\\S]*?Status:\\s*🔴\\s*OPEN`, 'gi');
  return featurePattern.test(content);
}

/**
 * Count open questions.
 */
export function countOpenQuestions(): number {
  if (!fs.existsSync(PENDING_FILE)) return 0;

  const content = fs.readFileSync(PENDING_FILE, 'utf-8');
  const matches = content.match(/Status:\s*🔴\s*OPEN/gi);
  return matches ? matches.length : 0;
}
