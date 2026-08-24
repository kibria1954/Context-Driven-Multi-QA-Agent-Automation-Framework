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
import { buildReportData, recordRunHistory, ReportData } from '../utils/report-helpers';

const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'reports', 'generated');

function escapeHtml(value: string): string {
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b\[[0-9;]*m/g, '') // strip ANSI color codes from Playwright's terminal-formatted error messages
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Renders the trend history as a lightweight inline-SVG bar chart — no chart library dependency. */
function renderTrendChart(trends: ReportData['trends']): string {
  if (trends.length === 0) {
    return `<p style="color:var(--text-muted); font-size:0.875rem;">No run history yet — this data point will appear here starting with the next run.</p>`;
  }
  const w = 900, h = 160, padL = 36, padB = 24, padT = 12;
  const barGap = 6;
  const plotW = w - padL - 12;
  const plotH = h - padT - padB;
  const barW = Math.max(4, plotW / trends.length - barGap);

  const bars = trends.map((t, i) => {
    const x = padL + i * (barW + barGap);
    const barH = (Math.max(0, Math.min(100, t.passRate)) / 100) * plotH;
    const y = padT + (plotH - barH);
    const color = t.passRate >= 90 ? 'var(--success)' : t.passRate >= 70 ? 'var(--warning)' : 'var(--danger)';
    const label = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `<g>
      <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${color}" opacity="0.85">
        <title>${escapeHtml(t.runId)} — ${t.passRate}% (${t.totalTests} tests) — ${escapeHtml(label)}</title>
      </rect>
      <text x="${x + barW / 2}" y="${h - 6}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${escapeHtml(label)}</text>
    </g>`;
  }).join('');

  const gridLines = [0, 25, 50, 75, 100].map((pct) => {
    const y = padT + (plotH - (pct / 100) * plotH);
    return `<line x1="${padL}" y1="${y}" x2="${w - 12}" y2="${y}" stroke="var(--border)" stroke-width="1" />
      <text x="${padL - 6}" y="${y + 3}" text-anchor="end" font-size="9" fill="var(--text-muted)">${pct}%</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%; height:auto;">${gridLines}${bars}</svg>`;
}

/** Prominent banner surfacing admin/customer login health from the last global-setup run. */
function renderSetupBanner(setupStatus: ReportData['setupStatus']): string {
  if (setupStatus.length === 0) return '';
  const failures = setupStatus.filter((s) => !s.success);
  if (failures.length === 0) {
    return `<div class="banner banner-ok">
      ✅ <strong>Auth setup healthy</strong> — admin &amp; customer sessions verified before this run (real \`.Nop.Authentication\` cookie confirmed, not just "no error thrown").
    </div>`;
  }
  return `<div class="banner banner-fail">
    <div style="font-size:1.05rem; margin-bottom:8px;">🚨 <strong>Auth setup FAILED for: ${failures.map((f) => f.role).join(', ')}</strong></div>
    <div style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:10px;">
      Every test below that reuses this role's storageState (e.g. <code>withAdminPage()</code>, the <code>admin-chromium</code> project) ran <strong>unauthenticated</strong>.
      Their failures are a downstream symptom of this one root cause, not ${failures.length > 1 ? 'independent bugs' : 'an independent bug'}.
    </div>
    ${failures.map((f) => `
      <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:8px; padding:10px 14px; margin-top:6px;">
        <strong style="color:var(--danger); text-transform:capitalize;">${f.role}</strong>
        <div style="font-family:'SFMono-Regular',Consolas,monospace; font-size:0.8rem; color:var(--text-secondary); margin-top:4px; white-space:pre-wrap;">${escapeHtml(f.error || 'Unknown error')}</div>
      </div>
    `).join('')}
  </div>`;
}

export function generateCustomReport(storyName = 'b2b-registration', runId = `run-${Date.now()}`): void {
  const data = buildReportData(storyName, runId, 'staging');
  recordRunHistory(data);
  // Include this run as the latest point on its own trend chart, not just prior runs.
  data.trends = [
    ...data.trends,
    { runId: data.metadata.runId, date: data.metadata.reportDate, passRate: data.summary.passRate, totalTests: data.summary.totalTests, duration: data.summary.duration },
  ].slice(-20);

  const passRate = data.summary.passRate;
  const passColor = passRate >= 90 ? '#10b981' : passRate >= 70 ? '#f59e0b' : '#ef4444';
  const setupFailed = data.setupStatus.some((s) => !s.success);

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
    .badge-browser { background: rgba(255,255,255,0.06); color: var(--text-secondary); border: 1px solid var(--border); }
    .progress-bar { width: 100%; height: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; margin: 8px 0; }
    .progress-fill { height: 100%; border-radius: 12px; transition: width 1s ease; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; }
    .footer { text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.75rem; border-top: 1px solid var(--border); margin-top: 40px; }
    .banner { border-radius: var(--radius); padding: 16px 20px; margin-bottom: 24px; border: 1px solid var(--border); }
    .banner-ok { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.3); color: var(--text-primary); }
    .banner-fail { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.35); color: var(--text-primary); }
    .error-cell { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 0.75rem; color: var(--danger); max-width: 320px; white-space: pre-wrap; word-break: break-word; }
    .row-blocked { background: rgba(239,68,68,0.04); }
    .screenshot-link { color: var(--info); font-size: 0.75rem; text-decoration: none; }
    .screenshot-link:hover { text-decoration: underline; }
    .live-dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--success); margin-right:6px; box-shadow: 0 0 6px var(--success); }
    .status-pill { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:6px; font-size:0.8rem; font-weight:700; letter-spacing:0.03em; white-space:nowrap; }
    .status-pass { background:rgba(16,185,129,0.18); color:#34d399; border:1px solid rgba(16,185,129,0.4); }
    .status-fail { background:rgba(239,68,68,0.18); color:#f87171; border:1px solid rgba(239,68,68,0.4); }
    .status-skip { background:rgba(100,116,139,0.18); color:#cbd5e1; border:1px solid rgba(100,116,139,0.4); }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤖 Context-Driven AI QA Agent — Executive Dashboard</h1>
    <div class="meta">
      <span class="live-dot"></span>Feature: ${data.metadata.pipelineStory} | Env: ${data.metadata.environment} | Date: ${new Date(data.metadata.reportDate).toLocaleString()} | Run: ${data.metadata.runId}
    </div>
  </div>
  <div class="container">
    ${renderSetupBanner(data.setupStatus)}
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
        <thead><tr><th>TC-ID</th><th>Name</th><th>Browser</th><th>Type</th><th>Status</th><th>Duration</th><th>REQ-ID</th><th>Failure Reason</th><th>Evidence</th></tr></thead>
        <tbody>
        ${data.testResults.map(t => {
          const failed = t.status === 'failed';
          const statusIcon = t.status === 'passed' ? '✅' : t.status === 'failed' ? '❌' : t.status === 'quarantined' ? '🚧' : '⏭️';
          const statusClass = t.status === 'passed' ? 'pass' : t.status === 'failed' ? 'fail' : 'skip';
          const flaky = t.status === 'passed' && t.retries > 0;
          return `
          <tr${failed && setupFailed ? ' class="row-blocked"' : ''}>
            <td><strong>${t.tcId}</strong></td>
            <td>${escapeHtml(t.name)}${failed && setupFailed ? ' <span class="badge badge-fail" title="A verified admin/customer login failure was recorded earlier in this run">🔒 Blocked by auth setup</span>' : ''}</td>
            <td><span class="badge badge-browser">${escapeHtml(t.project)}</span></td>
            <td><span class="badge badge-${t.type}">${t.type}</span></td>
            <td>
              <span class="status-pill status-${statusClass}">${statusIcon} ${t.status.toUpperCase()}</span>
              ${flaky ? `<span class="badge badge-negative" title="Failed on first attempt, passed on retry — investigate for flakiness even though the final result is green">🔁 flaky (${t.retries} retr${t.retries === 1 ? 'y' : 'ies'})</span>` : ''}
            </td>
            <td>${(t.duration / 1000).toFixed(1)}s</td>
            <td>${t.reqId || '—'}</td>
            <td class="error-cell">${t.error ? escapeHtml(t.error).slice(0, 400) : '—'}</td>
            <td>${t.screenshot ? `<a class="screenshot-link" href="${escapeHtml(t.screenshot).replace(/\\/g, '/')}" target="_blank" rel="noopener">📷 screenshot</a>` : '—'}</td>
          </tr>
        `;
        }).join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>📈 Pass Rate Trend (last ${data.trends.length} run${data.trends.length === 1 ? '' : 's'})</h2>
      ${renderTrendChart(data.trends)}
    </div>

    ${data.selfHealLog.length > 0 ? `
    <div class="card">
      <h2>🩹 Self-Heal Log</h2>
      <table>
        <thead><tr><th>Timestamp</th><th>Test</th><th>Failure Class</th><th>Action Taken</th><th>Iteration</th></tr></thead>
        <tbody>
        ${data.selfHealLog.map(e => `
          <tr>
            <td>${new Date(e.timestamp).toLocaleString()}</td>
            <td>${escapeHtml(e.testTitle)}</td>
            <td><span class="badge badge-negative">${escapeHtml(e.failureClass)}</span></td>
            <td>${escapeHtml(e.actionTaken)}</td>
            <td>${e.iteration}</td>
          </tr>
        `).join('')}
        </tbody>
      </table>
    </div>` : `
    <div class="card">
      <h2>🩹 Self-Heal Log</h2>
      <p style="color:var(--text-secondary); font-size:0.875rem;">✅ No self-healing was needed during this feature's test runs.</p>
    </div>`}

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
      ${data.traceabilityMatrix.length === 0 && data.testResults.length > 0 ? `
      <div class="banner" style="background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.3); margin-bottom:16px;">
        ⚠️ <strong>No traceability matrix found for this feature.</strong> Run coverage validation (Stage 7: <code>npx ts-node scripts/validate-coverage.ts --story=${data.metadata.pipelineStory}</code>) to populate this section.
      </div>` : ''}
      <div style="margin-bottom: 12px; font-size: 0.875rem; color: var(--text-secondary);">
        Overall Requirements Coverage: <strong style="color:${data.coverage.coveragePercentage >= 90 ? 'var(--success)' : data.coverage.coveragePercentage >= 70 ? 'var(--warning)' : 'var(--danger)'}; font-size: 1.1rem;">${data.coverage.coveragePercentage}% COVERED</strong> (${data.coverage.coveredRequirements}/${data.coverage.totalRequirements} REQ-IDs Mapped to Automated Assertions)
      </div>
      <table>
        <thead><tr><th>REQ-ID</th><th>Requirement Description</th><th>Mapped Test Cases</th><th>Spec File</th><th>Status</th></tr></thead>
        <tbody>
        ${data.traceabilityMatrix.map(tm => `
          <tr>
            <td><strong style="color:var(--accent)">${tm.reqId}</strong></td>
            <td style="max-width:400px; font-size:0.8rem;">${escapeHtml(tm.requirement)}</td>
            <td>${tm.testCases.map(tc => `<span class="badge badge-positive" style="margin-right:4px;">${tc}</span>`).join('') || '<em>None</em>'}</td>
            <td><code>${escapeHtml(tm.specFile)}</code></td>
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

  const setupFailures = data.setupStatus.filter((s) => !s.success);
  if (setupFailures.length > 0) {
    mdContent += `## 🚨 Auth Setup Failure\n\n`;
    for (const f of setupFailures) {
      mdContent += `- **${f.role}** login failed: \`${f.error}\`\n`;
    }
    mdContent += `\nEvery failure below that reuses this role's session ran unauthenticated as a direct consequence — treat them as one root cause, not ${setupFailures.length > 1 ? 'independent bugs' : 'an independent bug'}.\n\n`;
  }

  mdContent += `---\n\n`;
  mdContent += `## 📋 Test Execution Table\n\n`;
  mdContent += `| TC-ID | Scenario Name | Browser | Type | Status | Duration | REQ-ID | Failure Reason |\n`;
  mdContent += `|---|---|---|---|---|---|---|---|\n`;
  for (const t of data.testResults) {
    // eslint-disable-next-line no-control-regex
    const reason = t.error ? t.error.replace(/\x1b\[[0-9;]*m/g, '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 200) : '—';
    const statusText = t.status === 'passed' && t.retries > 0 ? `✅ PASSED (flaky, ${t.retries} retr${t.retries === 1 ? 'y' : 'ies'})` : `${t.status === 'passed' ? '✅' : t.status === 'failed' ? '❌' : '⏭️'} ${t.status.toUpperCase()}`;
    mdContent += `| \`${t.tcId}\` | ${t.name} | \`${t.project}\` | \`${t.type}\` | ${statusText} | ${(t.duration / 1000).toFixed(1)}s | \`${t.reqId || '—'}\` | ${reason} |\n`;
  }

  fs.writeFileSync(mdFile, mdContent, 'utf8');

  console.log(`\n📊 Stage 8: Custom HTML & Markdown Reports Generated Successfully!`);
  console.log(`  ✅ HTML Dashboard: reports/generated/${storyName}-report.html`);
  console.log(`  📄 Markdown Report: reports/generated/${storyName}-report.md`);
  console.log(`  📊 Pass Rate: ${data.summary.passRate}% (${data.summary.passed}/${data.summary.totalTests} Passed)`);
}

/** Discover every feature with ingested requirements (mirrors scripts/validate-coverage.ts). */
function discoverFeatures(): string[] {
  const reqDir = path.join(ROOT, 'requirements');
  if (!fs.existsSync(reqDir)) return [];
  return fs.readdirSync(reqDir).filter((f) => {
    const full = path.join(reqDir, f);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'parsed.json'));
  });
}

// CLI Execution Support
if (require.main === module) {
  const args = process.argv.slice(2);
  const runAll = args.includes('--all');
  const storyArg = args.find((a) => a.startsWith('--story='))?.split('=')[1] || 'b2b-registration';
  const runArg = args.find((a) => a.startsWith('--run='))?.split('=')[1] || `run-${Date.now()}`;

  if (runAll) {
    const features = discoverFeatures();
    if (features.length === 0) {
      console.error('❌ No features found. Create requirements/{feature}/parsed.json first.');
      process.exit(1);
    }
    for (const feature of features) {
      generateCustomReport(feature, `run-${Date.now()}`);
    }
    console.log(`\n✅ Generated ${features.length} report(s): ${features.join(', ')}`);
  } else {
    generateCustomReport(storyArg, runArg);
  }
}
