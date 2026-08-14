/**
 * CLI Script: Custom Report Generator
 *
 * Generates custom HTML & Markdown executive report dashboard.
 *
 * Usage:
 *   npx ts-node scripts/generate-report.ts --story=b2b-registration
 */
import * as fs from 'fs';
import * as path from 'path';
import { buildReportData, ReportData } from '../utils/report-helpers';

const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'reports', 'generated');

export function generateCustomReport(storyName = 'b2b-registration', runId = `run-${Date.now()}`): void {
  const data = buildReportData(storyName, runId, 'staging');
  const passRate = data.summary.passRate;
  const passColor = passRate >= 90 ? '#10b981' : passRate >= 70 ? '#f59e0b' : '#ef4444';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QA Executive Dashboard — ${data.metadata.pipelineStory}</title>
  <style>
    :root {
      --bg-primary: #0f172a; --bg-secondary: #1e293b; --bg-card: #1e293b;
      --text-primary: #f1f5f9; --text-secondary: #94a3b8; --text-muted: #64748b;
      --accent: #3b82f6; --accent-glow: rgba(59,130,246,0.3);
      --success: #10b981; --danger: #ef4444; --warning: #f59e0b; --info: #06b6d4;
      --border: rgba(255,255,255,0.08); --radius: 12px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    .container { max-width: 1400px; margin: 0 auto; padding: 24px; }
    .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1a1a2e 100%); border-bottom: 1px solid var(--border); margin-bottom: 32px; }
    .header h1 { font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, #60a5fa, #a78bfa); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .header .meta { color: var(--text-secondary); font-size: 0.875rem; margin-top: 8px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; text-align: center; transition: transform 0.2s, box-shadow 0.2s; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
    .stat-card .value { font-size: 2.5rem; font-weight: 700; }
    .stat-card .label { color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
    .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 24px; }
    .card h2 { font-size: 1.25rem; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th { background: rgba(59,130,246,0.1); color: var(--accent); font-weight: 600; text-align: left; padding: 10px 12px; border-bottom: 2px solid var(--border); }
    td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
    tr:hover { background: rgba(255,255,255,0.02); }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge-pass { background: rgba(16,185,129,0.15); color: var(--success); }
    .badge-fail { background: rgba(239,68,68,0.15); color: var(--danger); }
    .badge-skip { background: rgba(100,116,139,0.15); color: var(--text-muted); }
    .badge-positive { background: rgba(59,130,246,0.15); color: var(--accent); }
    .badge-negative { background: rgba(249,115,22,0.15); color: #f97316; }
    .badge-edge { background: rgba(168,85,247,0.15); color: #a855f7; }
    .progress-bar { width: 100%; height: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; margin: 8px 0; }
    .progress-fill { height: 100%; border-radius: 12px; transition: width 1s ease; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; }
    .footer { text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.75rem; border-top: 1px solid var(--border); margin-top: 40px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤖 Context-Driven AI QA Agent — Executive Dashboard</h1>
    <div class="meta">
      Feature: ${data.metadata.pipelineStory} | Env: ${data.metadata.environment} | Date: ${new Date(data.metadata.reportDate).toLocaleString()} | Run: ${data.metadata.runId}
    </div>
  </div>
  <div class="container">
    <div class="grid">
      <div class="stat-card"><div class="value" style="color:${passColor}">${data.summary.passRate}%</div><div class="label">Pass Rate</div></div>
      <div class="stat-card"><div class="value">${data.summary.totalTests}</div><div class="label">Total Tests</div></div>
      <div class="stat-card"><div class="value" style="color:var(--success)">${data.summary.passed}</div><div class="label">Passed</div></div>
      <div class="stat-card"><div class="value" style="color:var(--danger)">${data.summary.failed}</div><div class="label">Failed</div></div>
      <div class="stat-card"><div class="value" style="color:var(--warning)">${data.summary.skipped}</div><div class="label">Skipped</div></div>
      <div class="stat-card"><div class="value" style="color:var(--info)">${data.summary.quarantined}</div><div class="label">Quarantined</div></div>
    </div>

    <div class="card">
      <h2>📈 Overall Execution Pass Rate</h2>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${data.summary.passRate}%;background:linear-gradient(90deg,${passColor},${passColor}cc)">
          ${data.summary.passRate}%
        </div>
      </div>
    </div>

    <div class="card">
      <h2>📋 Test Execution Details</h2>
      <table>
        <thead><tr><th>TC-ID</th><th>Name</th><th>Type</th><th>Status</th><th>Duration</th><th>REQ-ID</th></tr></thead>
        <tbody>
        ${data.testResults.map(t => `
          <tr>
            <td><strong>${t.tcId}</strong></td>
            <td>${t.name}</td>
            <td><span class="badge badge-${t.type}">${t.type}</span></td>
            <td><span class="badge badge-${t.status === 'passed' ? 'pass' : t.status === 'failed' ? 'fail' : 'skip'}">${t.status.toUpperCase()}</span></td>
            <td>${(t.duration / 1000).toFixed(1)}s</td>
            <td>${t.reqId || '—'}</td>
          </tr>
        `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>🎯 Scenario Coverage Breakdown</h2>
      <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
        <div class="stat-card"><div class="value" style="color:var(--accent)">${data.coverage.positiveCount}</div><div class="label">Positive Scenarios</div></div>
        <div class="stat-card"><div class="value" style="color:#f97316">${data.coverage.negativeCount}</div><div class="label">Negative Scenarios</div></div>
        <div class="stat-card"><div class="value" style="color:#a855f7">${data.coverage.edgeCount}</div><div class="label">Edge Scenarios</div></div>
      </div>
    </div>

    <div class="card">
      <h2>🛡️ 100% Requirements Traceability Matrix & Assertion Audit</h2>
      <div style="margin-bottom: 12px; font-size: 0.875rem; color: var(--text-secondary);">
        Overall Requirements Coverage: <strong style="color:var(--success); font-size: 1.1rem;">${data.coverage.coveragePercentage}% COVERED</strong> (${data.coverage.coveredRequirements}/${data.coverage.totalRequirements} REQ-IDs Mapped to Automated Assertions)
      </div>
      <table>
        <thead><tr><th>REQ-ID</th><th>Requirement Description</th><th>Mapped Test Cases</th><th>Spec File</th><th>Status</th></tr></thead>
        <tbody>
        ${data.traceabilityMatrix.map(tm => `
          <tr>
            <td><strong style="color:var(--accent)">${tm.reqId}</strong></td>
            <td>${tm.requirement}</td>
            <td>${tm.testCases.map(tc => `<span class="badge badge-positive" style="margin-right:4px;">${tc}</span>`).join('') || '<em>None</em>'}</td>
            <td><code>${tm.specFile}</code></td>
            <td><span class="badge ${tm.status === 'covered' ? 'badge-pass' : 'badge-fail'}">${tm.status === 'covered' ? '✅ COVERED' : '❌ UNCOVERED'}</span></td>
          </tr>
        `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="footer">
    Generated by Context-Driven AI QA Agent | ${data.metadata.projectName} | ${new Date().toISOString()}
  </div>
</body>
</html>`;

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const htmlFile = path.join(REPORTS_DIR, `${storyName}-report.html`);
  const mdFile = path.join(REPORTS_DIR, `${storyName}-report.md`);

  fs.writeFileSync(htmlFile, html, 'utf8');

  // Also write Markdown Summary Report
  let mdContent = `# 📊 Executive Test Report — \`${storyName}\`\n\n`;
  mdContent += `- **Story**: \`${storyName}\`\n`;
  mdContent += `- **Pass Rate**: **${data.summary.passRate}%**\n`;
  mdContent += `- **Total Tests**: ${data.summary.totalTests} | ✅ Passed: ${data.summary.passed} | ❌ Failed: ${data.summary.failed} | ⏭️ Skipped: ${data.summary.skipped}\n`;
  mdContent += `- **Report Generated**: \`${new Date().toLocaleString()}\`\n\n`;
  mdContent += `---\n\n`;
  mdContent += `## 📋 Test Execution Table\n\n`;
  mdContent += `| TC-ID | Scenario Name | Type | Status | Duration | REQ-ID |\n`;
  mdContent += `|---|---|---|---|---|---|\n`;
  for (const t of data.testResults) {
    mdContent += `| \`${t.tcId}\` | ${t.name} | \`${t.type}\` | **${t.status.toUpperCase()}** | ${(t.duration / 1000).toFixed(1)}s | \`${t.reqId || '—'}\` |\n`;
  }

  fs.writeFileSync(mdFile, mdContent, 'utf8');

  console.log(`\n📊 Stage 8: Custom HTML & Markdown Reports Generated Successfully!`);
  console.log(`  ✅ HTML Dashboard: reports/generated/${storyName}-report.html`);
  console.log(`  📄 Markdown Report: reports/generated/${storyName}-report.md`);
  console.log(`  📊 Pass Rate: ${data.summary.passRate}% (${data.summary.passed}/${data.summary.totalTests} Passed)`);
}

// CLI Execution Support
if (require.main === module) {
  const args = process.argv.slice(2);
  const storyArg = args.find((a) => a.startsWith('--story='))?.split('=')[1] || 'b2b-registration';
  const runArg = args.find((a) => a.startsWith('--run='))?.split('=')[1] || `run-${Date.now()}`;
  generateCustomReport(storyArg, runArg);
}
