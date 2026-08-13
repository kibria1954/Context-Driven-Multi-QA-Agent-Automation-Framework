---
name: 03-workflow-design
description: Map individual test cases into end-to-end user journeys and state transitions.
---

# Stage 3 — Workflow Design Skill

## Overview
Stage 3 maps atomic test cases from Stage 2 into cohesive end-to-end user journeys, establishing state transitions and workflow sequencing (e.g. Guest Registration ➔ Admin Application Review ➔ Admin Account Activation).

---

## 🛠️ State Machine & Journey Protocol

### 1. State Transitions Mapping
Map the lifecycle of entities across user roles:
- `STATE 0`: Guest / Unauthenticated Visitor
- `STATE 1`: Form Submitted / Pending Wholesale Application
- `STATE 2`: Admin Review (`/Admin/Customer/List`)
- `STATE 3`: Account Approved & Activated (`Active = true`)
- `STATE 4`: Active Wholesale Buyer Logged In

### 2. User Journey Structuring
Group individual `TC-XXX` items into ordered journeys:
- `J-01: B2B Wholesale Customer Registration & Admin Approval Pipeline`
  - Step 1: Guest submits registration (`TC-REG-001`)
  - Step 2: Uniqueness validation (`TC-REG-002`)
  - Step 3: Admin reviews application details in Admin Panel (`TC-REG-003`)
  - Step 4: Admin approves and activates account (`TC-REG-004`)

### 3. Async State Transition Handlers
Define explicit async waiting strategies for asynchronous state transitions:
- **Admin Approval / Webhook Latency**: Poll entity status endpoint or poll list table with exponential backoff (`maxWaitMs: 30000`).
- **Email Verification Tokens**: Intercept token via mock API / MailHog endpoint before navigating to activation URLs.

---

## 📄 Output Files
- `context/journeys/<story>.journey.md`
- `context/journeys/<story>.journey.json`
