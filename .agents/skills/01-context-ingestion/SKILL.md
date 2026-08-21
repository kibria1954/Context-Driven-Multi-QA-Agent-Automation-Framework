---
name: 01-context-ingestion
description: Ingest raw feature requirements, compute immutable SHA-256 hashes, parse into atomic REQ-ID clauses, detect changes with versioned archival, perform ambiguity audit, and support legacy/retrofit path.
---

# Agent 1 — Requirement Ingestion & Change Detection Skill

## Overview

Agent 1 takes a raw feature requirement (pasted text, user story, Trello/Jira card, or existing manual test suite) and transforms it into a clean, structured, traceable specification file. It detects changes between requirement versions, archives history, and triggers delta-only re-processing downstream. It is the **single source of truth** gate — nothing downstream should exist that can't be traced back to a clause Agent 1 produced.

> **Golden Rule:** If you're not sure what a requirement means, STOP and ASK. Never silently interpret an ambiguity.

---

## 📁 Files to Load

- **This file** (full read).
- The raw requirement input (pasted text, or an existing `requirements/{feature}/source.md` if re-ingesting).
- `requirements/{feature}/source.meta.json`, if it exists — needed to compare SHA-256 hashes for change detection.
- `memory/decisions.md` — search by topic keyword before treating anything as ambiguous; it may already be answered.
- **Don't load:** `utils/selectors.ts`, `pages/*.page.ts`, or any `workflows/`/`tests/` output — nothing downstream exists yet at this stage.

## ⚠️ Common Mistakes

- **Inventing acceptance criteria for an ambiguous clause instead of flagging `NEEDS_CLARIFICATION`.** This is the single most damaging mistake at this stage — every downstream artifact inherits the fabrication.
- **Skipping the SHA-256 hash step or fabricating a plausible-looking hash string.** A real incident: all 3 original features' `source.meta.json` had fabricated hash strings that were never actual SHA-256 output, silently breaking change-detection for months.
- **Creating a redundant `requirements/{feature}.md` file.** The template in Section 2 is for organizing your thinking only — it does not get saved as its own file; content goes into `parsed.json` + `clarifications.md`.
- **Forgetting to check `memory/decisions.md` before escalating** — re-asking a question the owner already answered wastes their time and erodes trust in the escalation channel.

## ✅ Gate Condition (check before starting, and again before marking this stage done)
- Zero unresolved `NEEDS_CLARIFICATION` items.
- SHA-256 hash stored and verified.
- All clauses have valid category and priority assignments.
- If change detected: stale downstream artifacts flagged.

## ❌ Blocked Conditions
- Any `NEEDS_CLARIFICATION` block with `status: "open"` → Pipeline halts at Agent 1.
- No raw input available → Escalate to owner for requirement source.

---

## 🛠️ Step-by-Step Protocol

### 1. Input Acceptance

Agent 1 accepts input in multiple formats:
- **Raw text** — user story pasted directly
- **Markdown file** — `requirements/{feature}/source.md`
- **External reference** — link to Trello/Jira card (extracted via MCP)
- **Legacy retrofit** — existing manual test suite or user story used to reconstruct a requirement doc (see Section 7)

### 2. Structured Requirement Template

Use the following template to organize your thinking before parsing into `parsed.json` (Section 4) — this structure does **not** get saved as its own file. In practice, its content ends up split across `requirements/{feature}/parsed.json` (the atomic REQ-ID clauses — the actual machine source of truth) and `requirements/{feature}/clarifications.md` (any ambiguity notes raised during structuring). Do not create a separate `requirements/{feature}.md` file — it would just be a third, redundant copy of the same information and has never actually been produced by this stage in practice.

```markdown
# Feature: {Feature Name}

## Description
{One-paragraph summary of what this feature does and why it matters.}

## Actors
- **Primary Actor:** {e.g., Wholesale Buyer, Admin, Guest User}
- **Secondary Actor:** {e.g., Admin Reviewer, System}

## Preconditions
- {Required system state before this feature can be exercised}

## Business Rules
- BR-01: {Specific business logic constraint}
- BR-02: {Another constraint}

## Acceptance Criteria
- AC-01: {Given/When/Then or declarative criterion}
- AC-02: {Another criterion}

## Out of Scope
- {Explicitly excluded functionality}

## Version History
| Version | Date | Change Summary | SHA-256 |
|---------|------|----------------|---------|
| v1 | {date} | Initial ingestion | {hash} |
```

### 3. Immutable Grounding & SHA-256 Hash

1. Read (or save) the raw input as `requirements/{feature}/source.md`.
2. Compute SHA-256 hash of `source.md` contents.
3. Store snapshot metadata in `requirements/{feature}/source.meta.json`:

```json
{
  "featureName": "{feature-name}",
  "sha256": "{computed-sha256-hash}",
  "version": 1,
  "ingestedAt": "{iso-timestamp}",
  "clauseCount": 0,
  "previousHash": null,
  "staleDownstream": []
}
```

### 4. Atomic Requirement Parsing

Parse the structured requirement into distinct `REQ-XX` clauses. Each clause is one testable statement.

**Parsed JSON Schema (`requirements/{feature}/parsed.json`):**

```json
{
  "featureName": "{feature-name}",
  "version": 1,
  "parsedAt": "{iso-timestamp}",
  "sha256": "{hash-of-source}",
  "requirements": [
    {
      "id": "REQ-01",
      "clause": "{The exact requirement text}",
      "category": "critical" | "functional" | "ui" | "security" | "a11y",
      "priority": "critical" | "high" | "medium" | "low",
      "status": "clear" | "needs_clarification",
      "clarificationNote": null | "{What's unclear and why}",
      "linkedAcceptanceCriteria": "AC-01"
    }
  ],
  "clarificationBlocks": []
}
```

**Category Classification Rules:**
| Category | When to Use |
|----------|------------|
| `critical` | Core happy-path functionality that blocks release if broken |
| `functional` | Business logic, data processing, state transitions |
| `ui` | Visual rendering, form fields, navigation, layout |
| `security` | Authentication, authorization, input sanitization, data protection |
| `a11y` | Accessibility: labels, focus order, screen reader, contrast |

### 5. Ambiguity Audit (`NEEDS_CLARIFICATION`)

Inspect every clause for ambiguous trigger patterns:

**Trigger Keywords:**
`etc.`, `as needed`, `appropriate`, `tbd`, `if applicable`, `reasonable`, `and more`, `similar`, `such as`, `for example` (when used as the only specification), `properly`, `correctly`, `nicely`, `user-friendly`

**On Detection:**
1. Mark the clause `status: "needs_clarification"`.
2. Add a `clarificationBlock` to `parsed.json`:

```json
{
  "reqId": "REQ-XX",
  "ambiguousPhrase": "{the exact ambiguous text}",
  "question": "{Plain-language question: what exactly does this mean?}",
  "suggestedInterpretations": [
    "{Interpretation A}",
    "{Interpretation B}"
  ],
  "status": "open"
}
```

3. Append the question to `memory/pending-questions.md`.
4. Append a matching entry to `requirements/{feature}/clarifications.md` (create it if it doesn't exist yet — header + one entry per ambiguous REQ-ID, with `Status: OPEN`). This is the feature-scoped, human-readable twin of the `pending-questions.md` entry.
5. **STOP processing this clause.** Do not invent acceptance criteria.
6. Ask the owner directly in chat.
7. Once answered: update the entry in `requirements/{feature}/clarifications.md` to `Status: ✅ RESOLVED` with the resolution text, update `parsed.json`'s clause to `status: "clear"`, and record the same answer in `memory/decisions.md` per the escalation flow in `AGENTS.md`.

### 6. Change Detection & Version Archival

When a feature requirement is re-submitted:

1. **Compute new SHA-256 hash** and compare with `source.meta.json.sha256`.
2. **If unchanged** → Skip re-ingestion, report "No changes detected."
3. **If changed:**
   a. Archive the previous version to `requirements/history/{feature}-v{n}.md`.
   b. Update `source.meta.json` with new hash, incremented version, and `previousHash`.
   c. Diff old vs new clauses:
      - **New clauses** → Add new REQ-IDs.
      - **Removed clauses** → Flag downstream artifacts (TCs, specs) as `ORPHANED`.
      - **Modified clauses** → Flag linked TCs as `STALE`.
   d. Update `source.meta.json.staleDownstream[]` with affected artifact paths.
   e. Notify orchestrator to re-trigger **only affected downstream agents** for the delta.

### 7. Legacy / Retrofit Path

For features that already exist in production without an AI-authored requirement:

1. Accept existing manual test suite, user story, or informal feature description as seed input.
2. Reconstruct a best-effort `requirements/{feature}.md` from the seed.
3. **Flag EVERY reconstructed clause** as `status: "inferred"` (not "clear"):

```json
{
  "id": "REQ-01",
  "clause": "{Reconstructed clause}",
  "status": "inferred",
  "clarificationNote": "Inferred from existing test suite / user story. Please confirm this matches intended behavior.",
  "inferredFrom": "manual-test-suite" | "user-story" | "production-observation"
}
```

4. Present the full reconstructed requirement to the owner for confirmation before proceeding.

---

## 📄 Output Files
- `requirements/{feature}/source.md` (Raw immutable input)
- `requirements/{feature}/source.meta.json` (SHA-256 hash, version metadata)
- `requirements/{feature}/parsed.json` (Atomic REQ-ID clauses with categories — the machine source of truth)
- `requirements/{feature}/clarifications.md` (Ambiguous clauses flagged during parsing, their questions, and — once answered — the resolution; see Section 5)
- `requirements/history/{feature}-v{n}.md` (Archived previous versions, written on change detection — Section 6)

_(Gate Condition and Blocked Conditions are listed near the top of this file, before the protocol — check them first.)_
