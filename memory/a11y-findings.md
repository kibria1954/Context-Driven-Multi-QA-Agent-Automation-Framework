# ♿ Accessibility Findings

> Non-blocking a11y scan results from Agent 3 (Live Explorer).
> Building a backlog for accessibility improvements.
> Status lifecycle: `open` (default, or reopened if a resolved/wontfix finding recurs) → `resolved` | `wontfix` via resolveA11yFinding() / npm run a11y:report.

---

| Impact | Rule | Element | Description | Feature | Page | Date | Status |
|--------|------|---------|-------------|---------|------|------|--------|
| critical | aria-allowed-attr | `.header-account-trigger` | Ensure an element's role supports its ARIA attributes | wishlist-management | /wishlist | 2026-08-21 | open |
| serious | aria-input-field-name | `#SearchCategoryId-button` | Ensure every ARIA input field has an accessible name | wishlist-management | /wishlist | 2026-08-21 | open |
| moderate | landmark-unique | `.mm-navbar--grid` | Ensure landmarks are unique | wishlist-management | /wishlist | 2026-08-21 | open |
| moderate | region | `#swiper-wrapper (homepage carousel, present in header markup on every page)` | Ensure all page content is contained by landmarks | wishlist-management | /wishlist | 2026-08-21 | open |
