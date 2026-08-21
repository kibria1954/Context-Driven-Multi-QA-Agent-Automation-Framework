/**
 * a11y-report.ts — Accessibility Findings Summary Reporter (GAP-010)
 *
 * Reads memory/a11y-findings.md via utils/memory-helpers.ts's readA11yFindings()
 * (which parses the real `Status` column the table now carries), groups by
 * severity, and prints open/resolved/wontfix counts. Critical-impact open
 * findings are listed prominently.
 *
 * Also doubles as the CLI for resolving a finding:
 *   npx ts-node scripts/a11y-report.ts --resolve --feature=b2b-registration \
 *     --page=/register --rule=color-contrast --element="input#Email" [--status=wontfix]
 *
 * Plain report: npx ts-node scripts/a11y-report.ts
 */
import { readA11yFindings, resolveA11yFinding } from '../utils/memory-helpers';

const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

if (args.includes('--resolve')) {
  const feature = getArg('feature');
  const page = getArg('page');
  const rule = getArg('rule');
  const element = getArg('element');
  const status = (getArg('status') as 'resolved' | 'wontfix' | undefined) ?? 'resolved';

  if (!feature || !page || !rule || !element) {
    console.error('❌ Usage: --resolve --feature=... --page=... --rule=... --element=... [--status=resolved|wontfix]');
    process.exit(1);
  }

  const found = resolveA11yFinding(feature, page, rule, element, status);
  if (found) {
    console.log(`✅ Marked ${status}: [${feature}] ${rule} — ${element} (${page})`);
  } else {
    console.error(`❌ No matching open finding for [${feature}] ${rule} — ${element} (${page})`);
    process.exit(1);
  }
  process.exit(0);
}

console.log('\n♿ Accessibility Findings Report');
console.log('─'.repeat(50));

const deduped = readA11yFindings();

if (deduped.length === 0) {
  console.log('  ℹ️  No a11y-findings.md found (or no findings yet) — Agent 3 (Live Explorer) populates this during exploration.\n');
  process.exit(0);
}

const open = deduped.filter((r) => r.status === 'open');
const resolved = deduped.filter((r) => r.status === 'resolved');
const wontfix = deduped.filter((r) => r.status === 'wontfix');

const bySeverity = (sev: string) => open.filter((r) => r.impact === sev);
const critical = bySeverity('critical');
const serious = bySeverity('serious');
const moderate = bySeverity('moderate');
const minor = bySeverity('minor');

console.log(`\n📊 Summary: ${deduped.length} unique finding(s)`);
console.log(`   Open: ${open.length} | Resolved: ${resolved.length} | Won't Fix: ${wontfix.length}`);
console.log(`\nOpen by Severity:`);
console.log(`   🔴 Critical: ${critical.length}`);
console.log(`   🟠 Serious:  ${serious.length}`);
console.log(`   🟡 Moderate: ${moderate.length}`);
console.log(`   🟢 Minor:    ${minor.length}`);

if (critical.length > 0) {
  console.log('\n⛔ CRITICAL Open Findings (must be addressed):');
  critical.forEach((r, i) => {
    console.log(`   ${i + 1}. [${r.feature}] ${r.rule} — ${r.element}`);
    console.log(`      ${r.description}`);
    console.log(`      Page: ${r.page}`);
  });
}

if (serious.length > 0) {
  console.log('\n⚠️  Serious Open Findings:');
  serious.forEach((r, i) => {
    console.log(`   ${i + 1}. [${r.feature}] ${r.rule} — ${r.element} (${r.page})`);
  });
}

console.log('\n✅ A11y report complete.');
if (critical.length > 0) {
  console.log(`\n❌ ${critical.length} CRITICAL finding(s) need attention — consider blocking pipeline gate.\n`);
  // Configurable: uncomment to make critical findings block pipeline:
  // process.exit(1);
}
