---
name: 03-workflow-design
description: Map individual test cases into end-to-end user journeys and state transitions.
---

# Stage 3 — Workflow Design Skill

## Overview
Stage 3 maps atomic test cases from Stage 2 into cohesive end-to-end user journeys, establishing state transitions and workflow sequencing across primary system roles.

---

## 🛠️ State Machine & Journey Protocol

### 1. State Transitions Mapping
Map the lifecycle of entities across user roles:
- `STATE 0`: Initial / Unauthenticated / Empty State
- `STATE 1`: Action Submitted / Entity Created (Pending Status)
- `STATE 2`: Admin / Secondary Role Processing or Verification
- `STATE 3`: Entity Approved / Status Updated (`Active = true` / `Completed`)
- `STATE 4`: Post-Transition Operational State

### 2. User Journey Structuring
Group individual `TC-XXX` items into ordered journeys:
- `J-01: <Feature Name> End-to-End Workflow & Verification Pipeline`
  - Step 1: Initiator performs trigger action (`TC-XXX-001`)
  - Step 2: System validates input constraints & business rules (`TC-XXX-002`)
  - Step 3: Admin / Processing role verifies state transition (`TC-XXX-003`)
  - Step 4: System completes transaction / confirms state change (`TC-XXX-004`)

### 3. Async State Transition Handlers
Define explicit async waiting strategies for asynchronous state transitions:
- **Async Approval / Webhook / Processing Latency**: Poll entity status endpoint or UI table with exponential backoff (`maxWaitMs: 30000`).
- **Token / Email Notifications**: Intercept dynamic token or payload before navigating to confirmation URLs.

---

## 📄 Output Files
- `context/journeys/<story>.journey.md`
- `context/journeys/<story>.journey.json`
