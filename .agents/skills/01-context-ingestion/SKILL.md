---
name: 01-context-ingestion
description: Parse raw user story markdown requirements into structured parsed.json with ambiguity audit.
---

# Stage 1 — Context Ingestion Skill

## Overview
Stage 1 ingests raw user story requirements from `context/requirements/<story>/source.md`, calculates an immutable SHA-256 grounding hash, parses requirement clauses into atomic units (`REQ-01`, `REQ-02`, etc.), and performs an Ambiguity Audit to flag any underspecified terms (`NEEDS_CLARIFICATION`).

---

## 🛠️ Step-by-Step Protocol

### 1. Ingestion & Grounding Audit
- Read `context/requirements/<story>/source.md`.
- Compute SHA-256 hash of `source.md`.
- Store snapshot metadata in `context/requirements/<story>/source.meta.json`:
  ```json
  {
    "storyName": "<story-name>",
    "sha256": "<computed-sha256-hash>",
    "ingestedAt": "<iso-timestamp>",
    "clauseCount": 0
  }
  ```

### 2. Atomic Requirement Parsing
- Parse requirement text into distinct `REQ-XX` clauses.
- Categorize each requirement clause by type: `critical`, `functional`, `ui`, `security`.

### 3. Ambiguity Audit (`NEEDS_CLARIFICATION`)
- Inspect clause phrasing for ambiguous trigger keywords:
  - `etc.`, `as needed`, `appropriate`, `tbd`, `if applicable`, `reasonable`
- If ambiguous keywords exist, mark `clarificationNeeded: true` and add a `NEEDS_CLARIFICATION` block.
- **Rule**: Never invent acceptance criteria. Always ask the user directly in chat if ambiguities remain unresolved.

---

## 📄 Output Files
- `context/requirements/<story>/source.meta.json`
- `context/requirements/<story>/parsed.json`
