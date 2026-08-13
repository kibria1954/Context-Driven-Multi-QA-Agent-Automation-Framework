/**
 * Memory Helpers — Management and synchronization utilities for Dual-Store Memory Architecture.
 * Manages memory/healed-patterns.json and auto-syncs human-readable memory/healed-patterns.md.
 */
import * as fs from 'fs';
import * as path from 'path';

export interface HealedPattern {
  patternId: string;
  component: string;
  selectorPattern: string;
  interactionStrategy: string;
  successCount: number;
  failureCount: number;
  confidence: number;
  status: 'RAW' | 'CANDIDATE' | 'TRUSTED';
  lastValidated: string;
  applicablePages: string[];
}

export interface MemoryStore {
  version: string;
  lastUpdated: string;
  patterns: HealedPattern[];
}

const JSON_PATH = path.join(process.cwd(), 'memory', 'healed-patterns.json');
const MD_PATH = path.join(process.cwd(), 'memory', 'healed-patterns.md');

/**
 * Read current pattern memory store from JSON.
 */
export function readMemoryStore(): MemoryStore {
  try {
    if (fs.existsSync(JSON_PATH)) {
      return JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    }
  } catch (error) {
    console.warn('⚠️ Warning: Failed to read memory store:', (error as Error).message);
  }
  return { version: '1.0.0', lastUpdated: new Date().toISOString(), patterns: [] };
}

/**
 * Get all TRUSTED patterns for pre-emptive guidance in Stage 2/5 codegen.
 */
export function getTrustedPatterns(): HealedPattern[] {
  const store = readMemoryStore();
  return store.patterns.filter((p) => p.status === 'TRUSTED');
}

/**
 * Save updated memory store and auto-sync to Markdown documentation.
 */
export function saveMemoryStore(store: MemoryStore): void {
  store.lastUpdated = new Date().toISOString();
  fs.mkdirSync(path.dirname(JSON_PATH), { recursive: true });
  fs.writeFileSync(JSON_PATH, JSON.stringify(store, null, 2), 'utf-8');
  syncMemoryToMarkdown(store);
}

/**
 * Auto-sync memory JSON to human-readable Markdown table.
 */
export function syncMemoryToMarkdown(store: MemoryStore): void {
  const trustedCount = store.patterns.filter((p) => p.status === 'TRUSTED').length;
  const candidateCount = store.patterns.filter((p) => p.status === 'CANDIDATE').length;

  let mdContent = `# 🧠 Knowledge Base — Trusted UI Interaction Patterns\n\n`;
  mdContent += `> **Auto-synchronized from \`memory/healed-patterns.json\` by Stage 9 Learning Loop.**\n\n`;
  mdContent += `---\n\n`;
  mdContent += `## 📊 Summary Metrics\n`;
  mdContent += `- **Total Patterns Registered**: ${store.patterns.length}\n`;
  mdContent += `- **Trusted Patterns**: ${trustedCount} (\`status: TRUSTED\`)\n`;
  mdContent += `- **Candidate Patterns**: ${candidateCount} (\`status: CANDIDATE\`)\n`;
  mdContent += `- **Last Sync**: \`${store.lastUpdated}\` \n\n`;
  mdContent += `---\n\n`;
  mdContent += `## 🛡️ Trusted Interaction Patterns\n\n`;
  mdContent += `| Pattern ID | Component | Selector Pattern | Status | Success Count | Confidence | Interaction Strategy |\n`;
  mdContent += `|---|---|---|---|---|---|---|\n`;

  for (const pattern of store.patterns) {
    const confPercent = Math.round(pattern.confidence * 100);
    mdContent += `| \`${pattern.patternId}\` | ${pattern.component} | \`${pattern.selectorPattern}\` | \`${pattern.status}\` | ${pattern.successCount} | ${confPercent}% | ${pattern.interactionStrategy} |\n`;
  }

  fs.writeFileSync(MD_PATH, mdContent, 'utf-8');
}
