# Environment: Staging

## Connection
- **Base URL:** `https://kbd.nop-station.site`
- **Admin URL:** `https://kbd.nop-station.site/Admin`
- **API Base:** `https://kbd.nop-station.site`

## Safety
- **Write-Safe:** `true`
  - ✅ Agents 3 and 5 may perform state-changing actions (submit forms, create entities, update records)
  - ✅ Agent 0 may provision and clean up test data
  - ✅ Live Explorer may submit invalid data to capture error messages

## Credentials
- **Admin:** `process.env.ADMIN_EMAIL` / `process.env.ADMIN_PASSWORD`
- **Customer:** `process.env.CUSTOMER_EMAIL` / `process.env.CUSTOMER_PASSWORD`
- ⚠️ **NEVER inline credentials** — reference `process.env.*` variables only

## Health Check
- **Last Verified:** `2026-08-14T18:00:00Z`
- **Status:** `healthy`
- **Response Time:** `~800ms`

## Notes
- This is the primary testing environment for KBD NopCommerce
- Multi-popup/welcome modal appears on first visit — handled by `dismissAllModals()`
- Registration creates inactive accounts that require admin approval
- Admin panel is at `/Admin` path (not a separate domain)
- Uses NopCommerce 4.x with custom Korean Demands plugins
