# Environment: Production

## Connection
- **Base URL:** `{PRODUCTION_URL_NOT_CONFIGURED}`
- **Admin URL:** `{PRODUCTION_URL_NOT_CONFIGURED}/Admin`
- **API Base:** `{PRODUCTION_URL_NOT_CONFIGURED}`

## Safety
- **Write-Safe:** `false`
  - ❌ NO state-changing actions permitted
  - ❌ NO form submissions, entity creation, or data modifications
  - ✅ Read-only exploration and observation ONLY
  - ✅ Visual baseline capture permitted
  - ✅ Accessibility scanning permitted

## Credentials
- **Admin:** `process.env.PROD_ADMIN_EMAIL` / `process.env.PROD_ADMIN_PASSWORD`
- ⚠️ **NEVER inline credentials** — reference `process.env.*` variables only
- ⚠️ **Production credentials should have read-only permissions**

## Health Check
- **Last Verified:** `not yet verified`
- **Status:** `not configured`
- **Response Time:** `N/A`

## Notes
- ⛔ **THIS IS PRODUCTION** — no write actions permitted under any circumstances
- Use this environment ONLY for:
  - Visual regression baseline comparison
  - Drift detection (compare prod behavior vs staging)
  - Read-only accessibility scanning
- All test data operations MUST target staging, never production
