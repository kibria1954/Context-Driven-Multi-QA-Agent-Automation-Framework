/**
 * CLI Script: Coverage Validator & Traceability Generator
 *
 * Validates requirements-to-test traceability coverage and outputs .md matrix.
 *
 * Usage:
 *   npx ts-node scripts/validate-coverage.ts --story=b2b-registration
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const MEMORY_DIR = path.join(ROOT, 'memory');
const TRACE_DIR = path.join(MEMORY_DIR, 'traceability');

const args = process.argv.slice(2);
const storyName = args.find((a) => a.startsWith('--story='))?.split('=')[1] || 'b2b-registration';

console.log(`\n📊 Stage 6: Coverage Validation — "${storyName}"`);

const tcFile = path.join(ROOT, 'testcases', `${storyName}.tc.json`);
const testCases: any[] = fs.existsSync(tcFile) ? JSON.parse(fs.readFileSync(tcFile, 'utf8')).testCases || [] : [];

// Walk spec files
const specDir = path.join(ROOT, 'tests', 'e2e');
const specFiles: string[] = [];
const walk = (d: string) => {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d)) {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.spec.ts')) specFiles.push(full);
  }
};
walk(specDir);

// Scope to this feature's own spec file(s) only — REQ-IDs are locally numbered per
// feature, so matching against every spec repo-wide would cross-contaminate features
// that happen to share REQ-01, REQ-02, etc. Convention (see agents/orchestrator.ts
// stage 5): tests/e2e/**/{story}.spec.ts.
const ownSpecFiles = specFiles.filter((f) => path.basename(f) === `${storyName}.spec.ts`);

// ─── Parse each spec file's traceability header + per-test @REQ-N tags ───────
// Specs declare a "Requirements Covered:" header comment block (e.g. "- REQ-01: ...")
// and tag individual test titles with @REQ-NN. Both are used for accurate, per-test-case
// attribution instead of a loose "file contains this substring" match.
interface SpecCoverage {
  file: string;
  reqIds: Set<string>;
  testTitlesByReq: Map<string, string[]>;
}

function parseSpecCoverage(absPath: string): SpecCoverage {
  const content = fs.readFileSync(absPath, 'utf8');
  const reqIds = new Set<string>();
  const testTitlesByReq = new Map<string, string[]>();

  // Header block: lines like "*   - REQ-01: Some description"
  const headerMatches = content.matchAll(/REQ-\d+/g);
  for (const m of headerMatches) reqIds.add(m[0].toUpperCase());

  // Per-test title tags: test('TC-XXX: ... @REQ-01', ...)
  const testMatches = content.matchAll(/test\(\s*['"`]([^'"`]+)['"`]/g);
  for (const m of testMatches) {
    const title = m[1];
    const tagMatches = title.matchAll(/@REQ-(\d+)/gi);
    for (const tag of tagMatches) {
      const reqId = `REQ-${tag[1]}`;
      if (!testTitlesByReq.has(reqId)) testTitlesByReq.set(reqId, []);
      testTitlesByReq.get(reqId)!.push(title);
    }
  }

  return { file: path.relative(ROOT, absPath), reqIds, testTitlesByReq };
}

const specCoverages = ownSpecFiles.map(parseSpecCoverage);

const reqIds = [...new Set(testCases.map((tc: any) => tc.requirementId))];
const entries = reqIds.map((reqId) => {
  const tcs = testCases.filter((tc: any) => tc.requirementId === reqId);

  // A requirement is only "covered" if at least one test title explicitly tags it —
  // list every matching spec file/test title, not just the first hit.
  const matches = specCoverages
    .filter((sc) => sc.testTitlesByReq.has(reqId))
    .map((sc) => ({ file: sc.file, titles: sc.testTitlesByReq.get(reqId)! }));

  const specFiles2 = matches.map((m) => m.file);
  const testTitles = matches.flatMap((m) => m.titles);

  return {
    reqId,
    requirement: tcs[0]?.name || reqId,
    testCases: tcs.map((tc: any) => ({ tcId: tc.id, type: tc.type, status: tc.status })),
    specFile: specFiles2[0],
    specFiles: specFiles2,
    testTitles,
    coverageStatus: specFiles2.length > 0 ? 'covered' : 'uncovered',
  };
});

const covered = entries.filter((e) => e.coverageStatus === 'covered').length;
const uncovered = entries.filter((e) => e.coverageStatus === 'uncovered').length;
const coveragePercentage = reqIds.length > 0 ? Math.round((covered / reqIds.length) * 100) : 0;

fs.mkdirSync(TRACE_DIR, { recursive: true });

// Markdown matrix
let md = `# Requirements Traceability Matrix: ${storyName}\n\n`;
md += `- **Story ID:** \`STORY-${storyName.toUpperCase().replace(/-/g, '_')}\`\n`;
md += `- **Feature:** \`${storyName}\`\n`;
md += `- **Last Updated:** ${new Date().toISOString()}\n`;
md += `- **Overall Coverage:** **${coveragePercentage}%** (${covered}/${reqIds.length} Requirements Covered)\n`;
md += `- **Total Test Cases:** **${testCases.length}** (Positive: ${testCases.filter((t: any) => t.type === 'positive').length}, Negative: ${testCases.filter((t: any) => t.type === 'negative').length}, Edge/Security: ${testCases.filter((t: any) => t.type === 'edge').length})\n\n`;

md += `## Coverage Summary\n\n`;
md += `| Metric | Count |\n`;
md += `|---|---|\n`;
md += `| **Total Requirements** | ${reqIds.length} |\n`;
md += `| **Covered Requirements** | ${covered} (${coveragePercentage}%) |\n`;
md += `| **Uncovered Requirements** | ${uncovered} |\n`;
md += `| **Total Test Cases Mapped** | ${testCases.length} |\n\n`;

md += `## Requirements to Test Cases Traceability Table\n\n`;
md += `| Requirement ID | Requirement Description | Mapped Test Cases | Spec File(s) | Status |\n`;
md += `|---|---|---|---|---|\n`;

for (const entry of entries) {
  const tcList = entry.testCases.map((tc: any) => `\`${tc.tcId}\` (${tc.type})`).join(', ');
  const spec = entry.specFiles.length > 0 ? entry.specFiles.map((f) => `\`${f}\``).join('<br>') : '_None_';
  const statusBadge = entry.coverageStatus === 'covered' ? '✅ Covered' : '❌ Uncovered';
  md += `| **${entry.reqId}** | ${entry.requirement.replace(/\|/g, '\\|')} | ${tcList} | ${spec} | ${statusBadge} |\n`;
}

fs.writeFileSync(path.join(TRACE_DIR, `${storyName}.md`), md, 'utf8');
fs.writeFileSync(
  path.join(TRACE_DIR, `${storyName}.json`),
  JSON.stringify({ storyName, coveragePercentage, totalReqs: reqIds.length, covered, entries }, null, 2),
  'utf8'
);

console.log(`  💾 Saved Traceability Matrix (MD): memory/traceability/${storyName}.md`);
console.log(`  💾 Saved Traceability Matrix (JSON): memory/traceability/${storyName}.json`);
console.log(`\n✅ Coverage Validation Complete!`);
console.log(`   Coverage: ${coveragePercentage}% (${covered}/${reqIds.length})`);
console.log(`   Uncovered: ${uncovered}`);
