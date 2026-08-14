/**
 * Coverage Helpers — Cross-Feature Impact Detection & Flaky Quarantine
 *
 * Manages the page-dependency-index.md for cross-feature impact checks,
 * reads flaky-quarantine.md for coverage gap analysis, and provides
 * utilities for the Coverage & Traceability Agent (Agent 6).
 */
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PageDependency {
  pageObject: string;
  features: string[];
  lastModified: string;
}

export interface QuarantinedTest {
  testId: string;
  feature: string;
  quarantinedSince: string;
  consecutiveFails: number;
  rootCause: string;
  affectedReqIds: string[];
  status: 'quarantined' | 'resolved' | 'escalated';
}

export interface CoverageImpact {
  changedPage: string;
  affectedFeatures: string[];
  recommendation: string;
}

// ─── Paths ───────────────────────────────────────────────────────────────────

const MEMORY_DIR = path.resolve(process.cwd(), 'memory');
const PAGE_INDEX_FILE = path.join(MEMORY_DIR, 'page-dependency-index.md');
const QUARANTINE_FILE = path.join(MEMORY_DIR, 'flaky-quarantine.md');
const PAGES_DIR = path.resolve(process.cwd(), 'pages');

// ─── Page Dependency Index ───────────────────────────────────────────────────

/**
 * Scan page objects directory and build a dependency index from spec file imports.
 */
export function buildPageDependencyIndex(): PageDependency[] {
  const dependencies: PageDependency[] = [];

  if (!fs.existsSync(PAGES_DIR)) return dependencies;

  // Get all page object files
  const pageFiles = getAllPageFiles(PAGES_DIR);

  for (const pageFile of pageFiles) {
    const relativePath = path.relative(process.cwd(), pageFile).replace(/\\/g, '/');
    const basename = path.basename(pageFile);

    // Find which features reference this page object
    const features = findFeaturesUsingPage(basename);

    dependencies.push({
      pageObject: relativePath,
      features,
      lastModified: fs.statSync(pageFile).mtime.toISOString(),
    });
  }

  // Write the index
  writePageDependencyIndex(dependencies);

  return dependencies;
}

/**
 * Check cross-feature impact when a page object changes.
 */
export function checkCrossFeatureImpact(changedPageFile: string): CoverageImpact {
  const dependencies = readPageDependencyIndex();
  const basename = path.basename(changedPageFile);

  const dep = dependencies.find((d) => d.pageObject.includes(basename));

  if (!dep || dep.features.length <= 1) {
    return {
      changedPage: basename,
      affectedFeatures: dep?.features || [],
      recommendation: 'No cross-feature impact detected.',
    };
  }

  return {
    changedPage: basename,
    affectedFeatures: dep.features,
    recommendation: `Re-run Agent 3 (verify) + Agent 5 (execution) for: ${dep.features.join(', ')}`,
  };
}

// ─── Flaky Quarantine ────────────────────────────────────────────────────────

/**
 * Add a test to the flaky quarantine.
 */
export function quarantineTest(
  testId: string,
  feature: string,
  rootCause: string,
  affectedReqIds: string[] = []
): void {
  ensureFile(QUARANTINE_FILE, '# 🔶 Flaky Quarantine Register\n\n> Tests excluded from pipeline gating due to recurring transient failures.\n> Quarantined tests are still executed but don\'t block merges.\n\n---\n\n| Test | Feature | Since | Consecutive Fails | Root Cause | REQ-IDs Affected | Status |\n|------|---------|-------|-------------------|------------|------------------|--------|\n');

  const entry = `| ${testId} | ${feature} | ${new Date().toISOString().split('T')[0]} | 2 | ${rootCause} | ${affectedReqIds.join(', ') || 'N/A'} | QUARANTINED |\n`;

  fs.appendFileSync(QUARANTINE_FILE, entry, 'utf-8');
  console.log(`🔶 Quarantined: ${testId} (${feature}) — ${rootCause}`);
}

/**
 * Read quarantined tests and calculate coverage impact.
 */
export function getQuarantineImpact(): { count: number; affectedReqIds: string[] } {
  if (!fs.existsSync(QUARANTINE_FILE)) {
    return { count: 0, affectedReqIds: [] };
  }

  const content = fs.readFileSync(QUARANTINE_FILE, 'utf-8');
  const lines = content.split('\n').filter((l) => l.startsWith('|') && l.includes('QUARANTINED'));

  const reqIds: string[] = [];
  for (const line of lines) {
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length >= 7) {
      const reqs = cells[6]?.split(',').map((r) => r.trim()).filter(Boolean) || [];
      reqIds.push(...reqs);
    }
  }

  return {
    count: lines.length,
    affectedReqIds: [...new Set(reqIds)].filter((r) => r !== 'N/A'),
  };
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

function getAllPageFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllPageFiles(fullPath));
    } else if (entry.name.endsWith('.page.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function findFeaturesUsingPage(pageBasename: string): string[] {
  const features: string[] = [];
  const testsDir = path.resolve(process.cwd(), 'tests', 'e2e');

  if (!fs.existsSync(testsDir)) return features;

  const featureDirs = fs.readdirSync(testsDir, { withFileTypes: true });
  for (const featureDir of featureDirs) {
    if (!featureDir.isDirectory()) continue;

    const featurePath = path.join(testsDir, featureDir.name);
    const specFiles = fs.readdirSync(featurePath).filter((f) => f.endsWith('.spec.ts'));

    for (const specFile of specFiles) {
      const content = fs.readFileSync(path.join(featurePath, specFile), 'utf-8');
      const pageImportName = pageBasename.replace('.page.ts', '');

      if (content.includes(pageImportName) || content.includes(pageBasename)) {
        if (!features.includes(featureDir.name)) {
          features.push(featureDir.name);
        }
      }
    }
  }

  return features;
}

function readPageDependencyIndex(): PageDependency[] {
  // Read from the markdown table — simplified parsing
  if (!fs.existsSync(PAGE_INDEX_FILE)) return [];

  const content = fs.readFileSync(PAGE_INDEX_FILE, 'utf-8');
  const lines = content.split('\n').filter((l) => l.startsWith('|') && !l.includes('---') && !l.includes('Page Object'));

  return lines.map((line) => {
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    return {
      pageObject: cells[0]?.replace(/`/g, '') || '',
      features: cells[1]?.split(',').map((f) => f.trim()) || [],
      lastModified: cells[2] || '',
    };
  }).filter((d) => d.pageObject);
}

function writePageDependencyIndex(deps: PageDependency[]): void {
  let content = '# 📦 Page Dependency Index\n\n';
  content += '> Auto-generated by Agent 4/6. Maps which features use which shared page objects.\n';
  content += '> Used by Agent 6 for cross-feature impact detection when pages change.\n\n';
  content += '---\n\n';
  content += '| Page Object | Features Using It | Last Modified |\n';
  content += '|-------------|-------------------|---------------|\n';

  for (const dep of deps) {
    content += `| \`${dep.pageObject}\` | ${dep.features.join(', ')} | ${dep.lastModified.split('T')[0]} |\n`;
  }

  fs.mkdirSync(path.dirname(PAGE_INDEX_FILE), { recursive: true });
  fs.writeFileSync(PAGE_INDEX_FILE, content, 'utf-8');
}

function ensureFile(filePath: string, header: string): void {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, header, 'utf-8');
  }
}
