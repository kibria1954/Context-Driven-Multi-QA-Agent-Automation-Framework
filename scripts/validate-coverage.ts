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
const CONTEXT_DIR = path.join(ROOT, 'context');
const MEMORY_DIR = path.join(ROOT, 'memory');
const TRACE_DIR = path.join(MEMORY_DIR, 'traceability');

const args = process.argv.slice(2);
const storyName = args.find((a) => a.startsWith('--story='))?.split('=')[1] || 'b2b-registration';

console.log(`\n📊 Stage 6: Coverage Validation — "${storyName}"`);

const tcFile = path.join(CONTEXT_DIR, 'test-cases', `${storyName}.tc.json`);
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

const reqIds = [...new Set(testCases.map((tc: any) => tc.reqId))];
const entries = reqIds.map((reqId) => {
  const tcs = testCases.filter((tc: any) => tc.reqId === reqId);
  let specFile: string | undefined;
  for (const sf of specFiles) {
    const content = fs.readFileSync(sf, 'utf8');
    if (sf.toLowerCase().includes(storyName.toLowerCase()) || content.includes(reqId)) {
      specFile = path.relative(ROOT, sf);
      break;
    }
  }
  return {
    reqId,
    requirement: tcs[0]?.name || reqId,
    testCases: tcs.map((tc: any) => ({ tcId: tc.tcId, type: tc.type, status: tc.status })),
    specFile,
    coverageStatus: specFile ? 'covered' : 'uncovered',
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
md += `| Requirement ID | Requirement Description | Mapped Test Cases | Spec File | Status |\n`;
md += `|---|---|---|---|---|\n`;

for (const entry of entries) {
  const tcList = entry.testCases.map((tc: any) => `\`${tc.tcId}\` (${tc.type})`).join(', ');
  const spec = entry.specFile ? `\`${entry.specFile}\`` : '_None_';
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
