---
name: 00-testdata-environment
description: Provision test environments, synthetic test data, credentials validation, and teardown/cleanup — ensuring all downstream agents have safe, reliable prerequisites.
---

# Agent 0 — Test Data & Environment Skill

## Overview

Agent 0 owns everything the other agents assume "just exists" — environments, credentials, and test data. It runs **before any other agent** and ensures the pipeline has a safe, isolated, idempotent foundation. Without Agent 0 completing successfully, Agents 3–7 are blocked.

> **Golden Rule:** No agent should ever need to invent data on the fly, guess environment URLs, or wonder whether it's safe to write to a system.

---

## 🛠️ Step-by-Step Protocol

### 1. Environment Manifest Validation

Read and validate `envs/{env}.md` for the target environment. If no manifest exists, create one from template.

**Environment Manifest Template (`envs/{env}.md`):**

```markdown
# Environment: {env-name}

## Connection
- **Base URL:** `https://example.com`
- **Admin URL:** `https://example.com/Admin`
- **API Base:** `https://example.com/api`

## Safety
- **Write-Safe:** `true` | `false`
  - If `true`: Agents 3 and 5 may perform state-changing actions (submit forms, create entities, delete records)
  - If `false`: Read-only exploration and observation ONLY

## Credentials
- **Admin:** `process.env.ADMIN_EMAIL` / `process.env.ADMIN_PASSWORD`
- **Customer:** `process.env.CUSTOMER_EMAIL` / `process.env.CUSTOMER_PASSWORD`
- ⚠️ **NEVER inline credentials** — reference `process.env.*` variables only

## Health Check
- **Last Verified:** `{iso-timestamp}`
- **Status:** `healthy` | `degraded` | `unreachable`
- **Response Time:** `{ms}`

## Notes
- {Any environment-specific quirks, maintenance windows, or constraints}
```

### 2. Credential Security Enforcement

**Hard Rules (NEVER violated):**
- Credentials are NEVER written into generated test files, logs, screenshots, heal-log, or any committed file.
- `.env*` files are always git-ignored (verify `.gitignore` includes them).
- Test code references credentials via `process.env.*` and resolves at runtime.
- If a credential is detected in any generated file → **BLOCK** and escalate immediately.

### 3. Test Data Provisioning

For each feature requiring test data:

1. **Check `testdata/{feature}/` for existing seed data.**
2. **Generate synthetic data** using `utils/data-provisioner.ts`:
   - Users: Fake names, emails (using `@qa-test.example.com` domain), BD phone numbers
   - Companies: Fake company names with `QA-Auto-{runId}` prefix
   - Addresses: Synthetic BD addresses
   - Products/Orders: Reference existing catalog items by known SKU/ID
3. **Tag all created data** with `qa-agent-{run-id}` for scoped cleanup.
4. **Seed via API where possible** (faster, more reliable than UI):
   - Use `utils/api-helpers.ts` for direct entity creation
   - Fall back to UI seeding only when API is unavailable

**Test Data File Schema (`testdata/{feature}/seed.json`):**

```json
{
  "feature": "{feature-name}",
  "generatedAt": "{iso-timestamp}",
  "runId": "qa-agent-{run-id}",
  "entities": [
    {
      "type": "customer",
      "data": {
        "email": "test.{timestamp}.{random}@qa-test.example.com",
        "firstName": "{fake-name}",
        "lastName": "{fake-name}",
        "company": "QA-Auto-{run-id} Corp",
        "phone": "017XXXXXXXX"
      },
      "createdVia": "api" | "ui",
      "cleanupRequired": true
    }
  ]
}
```

### 4. Teardown & Cleanup Protocol

After a pipeline run completes (or on explicit cleanup trigger):

1. **Query all entities tagged with `qa-agent-{run-id}`.**
2. **Delete/deactivate via API** (preferred) or admin UI (fallback).
3. **Verify cleanup** — confirm entities no longer exist in the system.
4. **Log cleanup results** to `testdata/{feature}/cleanup-log.json`.

> ⚠️ **Never clean up production data.** Cleanup runs ONLY against `write-safe: true` environments.

### 5. Data Collision Detection

When multiple features or parallel runs target the same environment:

1. **Check for active run locks** in `testdata/.locks/`.
2. **Namespace test data** — each run uses unique email domains, company prefixes, and entity tags.
3. **If collision detected** → either serialize the runs or use separate data namespaces.

### 6. Unsafe Action Flagging

When a feature requires state that can't be safely faked:
- Payment capture / irreversible financial transactions
- Production database mutations
- Third-party webhook triggers with real consequences

**Action:** Flag the requirement in `memory/pending-questions.md` and escalate to owner for a sandboxed alternative. Do NOT proceed.

---

## 📄 Output Files
- `envs/{env}.md` (Environment manifest)
- `testdata/{feature}/seed.json` (Provisioned test data)
- `testdata/{feature}/cleanup-log.json` (Post-run cleanup results)

## ❌ Blocked Conditions
- If environment is `write-safe: false` → Agent 3 and Agent 5 are restricted to read-only.
- If credential validation fails → Pipeline halts, escalate to owner.
- If unsafe action detected → Pipeline halts with `pending-questions.md` entry.
