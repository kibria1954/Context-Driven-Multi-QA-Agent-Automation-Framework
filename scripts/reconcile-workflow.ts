/**
 * reconcile-workflow.ts — Journey ↔ Verify Divergence Checker (GAP-013)
 *
 * `workflows/{feature}.journey.json` (Stage 3 — what the design says SHOULD happen)
 * and `workflows/{feature}.verify.json` (Stage 4 — what live exploration actually
 * confirmed) are two independent documents with no shared schema key linking them,
 * and nothing ever cross-checked them against each other or against
 * `memory/decisions.md`. That's exactly how a real incident shipped undetected:
 * `workflows/b2b-registration.verify.json` kept asserting
 * `/Admin/ErpRegistrationApplication/List` as the "CONFIRMED REAL LOCATION" for
 * REQ-07 for days after `memory/decisions.md` D-001 (2026-08-18) recorded the real,
 * owner-confirmed answer as `/Admin/ErpAccount/List` — the actual page-object code
 * had already been fixed, but the verify.json record itself stayed stale and would
 * mislead any future re-codegen or human reading it. See
 * `06-execution-self-heal/SKILL.md` Class 8 (REQUIREMENT_VERIFICATION_ERROR) for the
 * full incident writeup.
 *
 * This script performs MECHANICAL checks only — pattern/keyword matching, not
 * semantic judgment:
 *   1. Journey steps whose action text mentions "Admin" have at least one
 *      non-superseded admin page recorded in verify.json.
 *   2. verify.json pages marked as a "confirmed"/"real location" note don't
 *      contradict a URL mentioned in a decisions.md entry for the same feature.
 *   3. Every TC-ID referenced in journey.json steps has a matching test title in
 *      the feature's spec file (orphaned journey steps with no automation).
 *   4. verify.json pages with no corresponding journey-step coverage at all
 *      (dead verification work, or an untested UI a journey should reference).
 *
 * Usage:
 *   npx ts-node scripts/reconcile-workflow.ts --story=b2b-registration
 *   npx ts-node scripts/reconcile-workflow.ts --all
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const WORKFLOWS_DIR = path.join(ROOT, 'workflows');
const RECONCILIATION_DIR = path.join(ROOT, 'memory', 'reconciliation');

const args = process.argv.slice(2);
const runAll = args.includes('--all');
const storyArg = args.find((a) => a.startsWith('--story='))?.split('=')[1];

function discoverFeatures(): string[] {
  if (!fs.existsSync(WORKFLOWS_DIR)) return [];
  return fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((f) => f.endsWith('.journey.json'))
    .map((f) => f.replace('.journey.json', ''))
    .filter((feature) => fs.existsSync(path.join(WORKFLOWS_DIR, `${feature}.verify.json`)));
}

const featuresToRun: string[] = runAll ? discoverFeatures() : storyArg ? [storyArg] : discoverFeatures();

interface Finding {
  severity: 'high' | 'medium';
  category: string;
  message: string;
}

function readJson(p: string): any | null {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

function findSpecFile(feature: string): string | null {
  const specDir = path.join(ROOT, 'tests', 'e2e');
  if (!fs.existsSync(specDir)) return null;
  const stack = [specDir];
  while (stack.length) {
    const dir = stack.pop() as string;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) stack.push(full);
      else if (entry === `${feature}.spec.ts`) return full;
    }
  }
  return null;
}

/**
 * Extract `/Admin/...`-shaped URL paths mentioned as the CORRECT answer in a
 * decisions.md entry applying to this feature — excluding URLs the same entry
 * explicitly rules out (e.g. "NOT at `/Admin/X`", "incorrectly assumed").
 * Naively collecting every /Admin/* URL mentioned would also capture the wrong
 * URL a correction is explicitly contrasting itself against (D-001 mentions both
 * the right and the wrong URL in one sentence) — that false negative was caught
 * by manually reverting the verify.json fix and confirming this function was the
 * reason Check 2 below didn't fire.
 */
function extractDecidedAdminUrls(decisionsContent: string, feature: string): Set<string> {
  const decided = new Set<string>();
  const ruledOut = new Set<string>();
  const blocks = decisionsContent.split(/(?=^## D-\d+)/m);
  for (const block of blocks) {
    if (!new RegExp(`Applied To.*\\b${feature}\\b`, 'i').test(block)) continue;
    // Tightly scoped: "NOT at `/Admin/X`" with the URL immediately backtick-wrapped
    // right after the phrase — NOT a lazy skip-ahead, which previously spanned
    // across sentences/paragraphs and swallowed the CORRECT url too (caught by
    // testing this against the real D-001 text, which restates the correct URL
    // a second time later in the same answer).
    for (const m of block.matchAll(/NOT at\s*`(\/Admin\/[A-Za-z0-9/_-]+)`/gi)) {
      ruledOut.add(m[1]);
    }
    for (const m of block.matchAll(/\/Admin\/[A-Za-z0-9/_-]+/g)) decided.add(m[0]);
  }
  for (const url of ruledOut) decided.delete(url);
  return decided;
}

function reconcileFeature(feature: string): Finding[] {
  const findings: Finding[] = [];
  const journey = readJson(path.join(WORKFLOWS_DIR, `${feature}.journey.json`));
  const verify = readJson(path.join(WORKFLOWS_DIR, `${feature}.verify.json`));

  if (!journey) {
    findings.push({ severity: 'high', category: 'MISSING_JOURNEY', message: `workflows/${feature}.journey.json missing or invalid — cannot reconcile.` });
    return findings;
  }
  if (!verify) {
    findings.push({ severity: 'high', category: 'MISSING_VERIFY', message: `workflows/${feature}.verify.json missing or invalid — Stage 4 has not run for this feature yet.` });
    return findings;
  }

  const journeys: any[] = journey.journeys ?? [];
  const pages: any[] = verify.pages ?? [];

  const isSuperseded = (page: any): boolean => {
    const text = `${page.pageName ?? ''} ${page.discrepancy ?? ''}`.toLowerCase();
    return /supersede|stale location|do not use/.test(text);
  };
  const activePages = pages.filter((p) => !isSuperseded(p));

  // ─── Check 1: journey steps mentioning "Admin" have a live (non-superseded) admin page ──
  const allSteps: Array<{ journeyId: string; tc: string; action: string }> = [];
  for (const j of journeys) {
    for (const step of j.steps ?? []) {
      allSteps.push({ journeyId: j.journeyId, tc: step.tc, action: step.action ?? '' });
    }
  }
  const adminSteps = allSteps.filter((s) => /\badmin\b/i.test(s.action));
  const hasActiveAdminPage = activePages.some((p) => /\/Admin\//i.test(p.urlPattern ?? ''));
  if (adminSteps.length > 0 && !hasActiveAdminPage) {
    findings.push({
      severity: 'high',
      category: 'UNVERIFIED_ADMIN_CLAIM',
      message: `${adminSteps.length} journey step(s) reference "Admin" (e.g. ${adminSteps[0].tc}: "${adminSteps[0].action}") but verify.json has no non-superseded /Admin/* page — this looks like the exact "admin sees X" claim pattern from the REQUIREMENT_VERIFICATION_ERROR incident (06-execution-self-heal/SKILL.md Class 8). Re-verify live before trusting it.`,
    });
  }

  // ─── Check 2: "confirmed real location" pages vs. decisions.md ─────────────────────────
  const decisionsPath = path.join(ROOT, 'memory', 'decisions.md');
  if (fs.existsSync(decisionsPath)) {
    const decidedUrls = extractDecidedAdminUrls(fs.readFileSync(decisionsPath, 'utf-8'), feature);
    if (decidedUrls.size > 0) {
      for (const p of activePages) {
        const noteText = `${p.note ?? ''}`.toLowerCase();
        if (!/confirmed|real location/.test(noteText)) continue;
        const url = p.urlPattern;
        if (url && !decidedUrls.has(url) && /\/Admin\//i.test(url)) {
          findings.push({
            severity: 'medium',
            category: 'CONTRADICTS_DECISION',
            message: `verify.json page "${p.pageName}" (${url}) claims "confirmed real location" but that URL doesn't match any /Admin/* URL recorded in memory/decisions.md for "${feature}" (decided: ${[...decidedUrls].join(', ')}). Confirm this is intentional (e.g. a different admin page) — otherwise this may be stale, same as the D-001 incident.`,
          });
        }
      }
    }
  }

  // ─── Check 3: orphaned journey TC-IDs (no matching test in the feature's spec) ──────────
  const specPath = findSpecFile(feature);
  if (specPath) {
    const specContent = fs.readFileSync(specPath, 'utf-8');
    const specTcIds = new Set([...specContent.matchAll(/test\(\s*[`'"](TC-\d+)/g)].map((m) => m[1]));
    const journeyTcIds = new Set<string>();
    for (const s of allSteps) {
      // steps sometimes reference "TC-003/006" style combined IDs — split on non-digit-prefixed separators
      for (const tc of (s.tc ?? '').split(/[,/]/).map((t: string) => t.trim())) {
        const m = tc.match(/TC-\d+/);
        if (m) journeyTcIds.add(m[0]);
      }
    }
    const orphaned = [...journeyTcIds].filter((tc) => !specTcIds.has(tc));
    if (orphaned.length > 0) {
      findings.push({
        severity: 'medium',
        category: 'ORPHANED_JOURNEY_TC',
        message: `${orphaned.length} TC-ID(s) referenced in journey.json have no matching test('TC-XXX...') in ${path.relative(ROOT, specPath)}: ${orphaned.join(', ')}`,
      });
    }
  } else {
    findings.push({ severity: 'medium', category: 'NO_SPEC_FILE', message: `No tests/e2e/**/${feature}.spec.ts found yet — cannot cross-check journey TC-IDs against automation (expected if Stage 5 hasn't run).` });
  }

  // ─── Check 4: verify.json pages with no journey-step coverage at all ───────────────────
  const journeyText = JSON.stringify(journeys).toLowerCase();
  for (const p of activePages) {
    const nameWords = (p.pageName ?? '').toLowerCase().split(/[^a-z0-9]+/).filter((w: string) => w.length > 3);
    const referenced = nameWords.some((w: string) => journeyText.includes(w));
    if (!referenced && nameWords.length > 0) {
      findings.push({
        severity: 'medium',
        category: 'UNREFERENCED_VERIFY_PAGE',
        message: `verify.json page "${p.pageName}" (${p.urlPattern}) isn't mentioned by name in any journey.json step action — dead verification work, or a journey step description that should call it out explicitly.`,
      });
    }
  }

  return findings;
}

function writeReport(feature: string, findings: Finding[]): void {
  fs.mkdirSync(RECONCILIATION_DIR, { recursive: true });
  let md = `# 🔗 Journey ↔ Verify Reconciliation — ${feature}\n\n`;
  md += `**Generated:** \`${new Date().toISOString()}\`\n\n`;
  if (findings.length === 0) {
    md += `✅ No divergences found.\n`;
  } else {
    md += `| Severity | Category | Finding |\n|---|---|---|\n`;
    for (const f of findings) {
      md += `| ${f.severity === 'high' ? '🔴 high' : '🟡 medium'} | \`${f.category}\` | ${f.message.replace(/\|/g, '\\|')} |\n`;
    }
  }
  fs.writeFileSync(path.join(RECONCILIATION_DIR, `${feature}.md`), md, 'utf-8');
}

if (featuresToRun.length === 0) {
  console.error('❌ No features found. Ensure workflows/{feature}.journey.json and .verify.json both exist.');
  process.exit(1);
}

let totalHigh = 0;
for (const feature of featuresToRun) {
  console.log(`\n🔗 Reconciling journey.json ↔ verify.json — "${feature}"`);
  const findings = reconcileFeature(feature);
  writeReport(feature, findings);

  if (findings.length === 0) {
    console.log(`  ✅ No divergences found.`);
  } else {
    for (const f of findings) {
      const icon = f.severity === 'high' ? '🔴' : '🟡';
      console.log(`  ${icon} [${f.category}] ${f.message}`);
      if (f.severity === 'high') totalHigh++;
    }
  }
  console.log(`  📁 Saved: memory/reconciliation/${feature}.md`);
}

if (totalHigh > 0) {
  console.log(`\n❌ ${totalHigh} high-severity divergence(s) found across ${featuresToRun.length} feature(s) — review before trusting affected verify.json claims.`);
}
