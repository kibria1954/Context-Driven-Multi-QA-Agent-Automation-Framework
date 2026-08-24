# 📋 Decisions Log — Owner Answers

> Append-only log of all owner decisions. Agents reference this to avoid re-asking the same question.
> When a question from `pending-questions.md` is answered, the decision is recorded here permanently.
> **Format:** `D-NNN — [Topic] — [Date]`

---

## D-001 — Admin ERP Application Location — 2026-08-18

- **Answered At:** `2026-08-18T12:30:00Z`
- **Answered By:** owner (verified via live site investigation)
- **Applied To:** b2b-registration, wholesale-checkout
- **Feature Context:** B2B Registration — REQ-07 (admin visibility)

**Question:** Where does a submitted B2B registration application appear in the admin panel?

**Answer:**
The submitted registration applications appear at `/Admin/ErpAccount/List` — NOT at
`/Admin/ErpRegistrationApplication/List` which was incorrectly assumed from the URL pattern.
The ERP Account list shows customer records that have been registered via the B2B form.
Agent 3 (Live Explorer) MUST navigate to `/Admin/ErpAccount/List` (not the registration list)
to verify admin-side visibility of B2B submissions.

---

## D-002 — Bangladeshi Phone Number Format — 2026-08-18

- **Answered At:** `2026-08-18T11:00:00Z`
- **Answered By:** owner
- **Applied To:** b2b-registration, any feature requiring phone input

**Question:** What phone number format is accepted by the KBD NopCommerce B2B registration form?

**Answer:**
Bangladeshi mobile format: `01X-XXXXXXXX` (11 digits total).
Valid prefixes: 017, 018, 019, 016, 015, 013.
Test data generator: `generateTestPhoneNumber()` in `utils/helpers.ts` produces valid numbers.
The form field `PhoneNumber` accepts strings — no special formatting required beyond the 11 digits.

---

## D-003 — NopCommerce Session Auth Cookie Name — 2026-08-18

- **Answered At:** `2026-08-18T11:00:00Z`
- **Answered By:** owner (verified via browser DevTools during live session)
- **Applied To:** global-setup.ts, verify-auth.ts, all auth-dependent tests

**Question:** What is the name of the NopCommerce authentication session cookie to verify after login?

**Answer:**
The session cookie is named `.Nop.Authentication`.
This is the definitive proof of a valid authenticated session.
`global-setup.ts` MUST check for this cookie in the resulting storageState file after login —
"didn't throw" or "page loaded" is NOT sufficient proof (see ANTI-006 in healed-patterns.json).
`verify-auth.ts` uses this cookie name for pre-flight validation.

---

## D-004 — Staging Base URL — 2026-08-18

- **Answered At:** `2026-08-18T10:00:00Z`
- **Answered By:** owner
- **Applied To:** all stages, playwright.config.ts, envs/staging.md

**Question:** What is the staging environment base URL for KBD NopCommerce?

**Answer:**
Staging: `https://kbd.nop-station.site`
Admin: `https://kbd.nop-station.site/Admin`
This URL is set in `.env.staging` (git-ignored) as `BASE_URL` and `ADMIN_URL`.
Do NOT use production URLs for write-action tests.

---

## D-005 — Select2 Dropdown Interaction Strategy — 2026-08-11

- **Answered At:** `2026-08-11T12:44:00Z`
- **Answered By:** owner (distilled from PAT-SEL2-001 in healed-patterns.json)
- **Applied To:** b2b-registration (company type, country fields), any page with Select2

**Question:** How should agents interact with Select2 custom dropdowns on NopCommerce?

**Answer:**
Do NOT use `.selectOption()` — Select2 replaces native `<select>` with custom spans.
Correct strategy (4 steps):
1. Click `span.select2-container` to open the dropdown
2. Fill the search input inside the dropdown (`.select2-search__field`)
3. Await options to appear (`ul.select2-results__options li.select2-results__option`)
4. Click the active/highlighted result item
This pattern is TRUSTED in PAT-SEL2-001 with successCount=7.

---

## D-006 — Welcome Modal Dismissal Strategy — 2026-08-11

- **Answered At:** `2026-08-11T12:44:00Z`
- **Answered By:** owner (distilled from PAT-MODAL-002)
- **Applied To:** all pages on kbd.nop-station.site (welcome modal appears on first visit)

**Question:** How should the KDN welcome/newsletter overlay modal be dismissed?

**Answer:**
Use DOM removal via `page.evaluate()`:
```javascript
document.querySelectorAll('#kdn-welcome-modal, .modal-backdrop').forEach(el => el.remove());
document.body.style.overflow = '';
document.body.classList.remove('modal-open');
```
The `dismissAllModals()` helper in `utils/helpers.ts` implements this.
ALWAYS call this helper after navigation in tests that aren't specifically testing the modal.

---

## D-007 — Test Data Cleanup Scope — 2026-08-18

- **Answered At:** `2026-08-18T10:30:00Z`
- **Answered By:** owner
- **Applied To:** testdata/ structure, global-teardown.ts, cleanup-check.ts

**Question:** Should test data cleanup delete records from the admin panel, or just log them?

**Answer:**
Log-only for now. The cleanup strategy is:
1. Record synthetic entity identifiers in `testdata/{feature}/cleanup-log.json`
2. After test run, mark them for review — do NOT auto-delete via API (no write-safety cleared for production deletes)
3. Staging: manual cleanup acceptable. Data is synthetic and prefixed `qa-test.*`
4. Production: N/A — production is `write-safe: false`, no test data is ever created there.

---

## D-008 — Pipeline Stage Execution Order — 2026-08-21

- **Answered At:** `2026-08-21T15:00:00Z`
- **Answered By:** owner (via framework review + orchestrator fix)
- **Applied To:** orchestrator.ts, all SKILL.md stage references

**Question:** Should Coverage Validation (Stage 6) run before or after Execution (Stage 7)?

**Answer:**
AFTER. Correct order: `Codegen(5) → Execution(6) → Coverage(7) → Report(8)`.
Coverage at stage 7 can now perform L4 checks (test actually ran in last execution).
The orchestrator was FIXED on 2026-08-21: stage 6 is now Execution, stage 7 is now Coverage.
All SKILL.md references to "Agent 5 = Execution, Agent 6 = Coverage" map to orchestrator
stages 6 and 7 respectively.

---

## D-009 — Wishlist Has Two Navigation Entry Points — 2026-08-21

- **Answered At:** `2026-08-21T16:30:00Z`
- **Answered By:** owner (note on requirement) + verified live via Playwright script during Stage 1 ingestion
- **Applied To:** wishlist-management

**Question:** Owner noted the Wishlist can be reached two ways — "My Account > Wishlist" and a navbar icon. Confirm both exist and where they lead.

**Answer:**
Confirmed live on staging (customer `userKBD@gmail.com`), both entry points resolve to the SAME page:
1. **Dashboard sidebar:** `/customer/info` sidebar lists `Dashboard / My Account / Wishlist / Order History / Order Report / Restock Requests / Pre-Orders / Notices`.
2. **Header navbar icon:** `a.ico-wishlist.header-link-wishlist` (href=`/wishlist`), with a count badge `span.wishlist-qty` showing `(n)`.
3. Both `/wishlist` and the sidebar link redirect/resolve to `/korean-wishlist` — this is the one real Wishlist page (page title "My account - Wishlist").
4. A third, unrelated `Wishlist` link also exists in the **footer** (`footer-menu__link`, href=`/korean-wishlist` directly) — not part of this requirement's two paths, but agents should use `.first()` or a scoped locator when selecting "the" wishlist link since 3 elements match generic text `Wishlist` on any page (header icon, sidebar item, footer link).
5. Empty-state text verified verbatim: "Your wishlist is empty." followed by a "Browse products" link to home.

Stage 2 (Test Case Design) must design REQ-01 and REQ-02 as two independent entry-point test cases converging on one destination, not two separate wishlist pages. Stage 5 (Codegen) must scope the wishlist-link locator to avoid the footer's ambiguous duplicate (see PAT-STRICT-004 in `memory/context-store.json`'s wishlist-management notes).

---

## D-010 — Add-to-Wishlist Mechanics: Real AJAX Endpoint, Verbatim Message, Popup Interference — 2026-08-21

- **Answered At:** `2026-08-21T17:00:00Z`
- **Answered By:** owner (verified via live Playwright script against real product during Stage 0/1)
- **Applied To:** wishlist-management

**Question:** REQ-05 said "proper success message" with no verbatim text — what does the live site actually show, and how does the add-to-wishlist button really behave?

**Answer:**
Verified end-to-end on staging using product id `63` (`/cream`, "Cream — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance", $33.00):
1. **Button:** `#add-to-wishlist-button-{productId}` (class `button-2 add-to-wishlist-button gallery-wishlist-btn`, title="Add to wishlist", inner `<span class="wishlist-text">Add to wishlist</span>`) — this is the "♡ Wishlist" button from the requirement; no literal ♡ glyph, the heart is a CSS/icon-font treatment.
2. **AJAX endpoint:** clicking POSTs to `/addproducttocart/details/{productId}/2` (NopCommerce's shared cart/wishlist endpoint — cart-type `2` = Wishlist). Codegen/Stage 4 should treat this like the existing `waitForAjaxComplete()` pattern used elsewhere, not a page navigation.
3. **Success message (verbatim, resolves REQ-05's clarificationNote):** bar notification text **"The product has been added to your wishlist"**.
4. **Header count:** `span.wishlist-qty` inside `a.header-link-wishlist` went `(0)` → `(1)` immediately after the AJAX response — confirms REQ-06.
5. **⚠️ Synthetic clicks don't work:** a JS-dispatched `element.click()` (untrusted event) does NOT trigger the AJAX call — only a real/trusted click (Playwright's `.click()`) fires it. Codegen must use real Playwright clicks, not `page.evaluate(() => el.click())`, for this button.
6. **Three independent overlay popups exist** on this site, any of which can block the click: `#kdn-welcome-modal` (existing, D-006), `#multi-popup-overlay` (promo, `data-auto-open="true"`, opens after a delay), and `.news-letter-popup-modal` (jQuery UI dialog + `.ui-widget-overlay` backdrop). `dismissAllModals()` already covered the first two; its `.news-letter-popup-modal, .ui-widget-overlay` gap (confirmed via string match, not assumed) was fixed directly in `utils/helpers.ts` during this feature's Stage 5 codegen — all three are now covered by the shared helper.
7. **View Wishlist page confirmed:** product card shows name, price, `Remove` button (`button.wishlist-remove-btn`, `onclick="removeWishlistItem({wishlistItemId}, this)"` — note the id passed is the wishlist-item id, not the product id), and an `Add to cart` button. Removing restores the exact empty-state text "Your wishlist is empty." + "Browse products" link.
8. Test account (`userKBD@gmail.com`) was left in the same empty-wishlist state it started in — the add/remove above was reverted, no persistent data left behind.

---

## D-011 — ⚠️ Header Wishlist Count Does NOT De-Duplicate Repeat Adds (Confirmed Discrepancy) — 2026-08-21

- **Answered At:** `2026-08-21T18:30:00Z`
- **Answered By:** owner (verified via live Playwright script during Stage 4)
- **Applied To:** wishlist-management (REQ-05, REQ-06, TC-014, TC-017, J-08)
- **Status:** ⚠️ OPEN — needs a product-owner call on whether this is intended or a bug. Recorded as observed fact, not silently patched over.

**Question:** REQ-05/TC-014 asked what happens when a customer clicks "Add to wishlist" on a product already in their wishlist.

**Answer — confirmed live, reproduced twice:**
1. Product 63 ("Cream") added once → header count `(0)` → `(1)`. Wishlist grid shows 1 `article.wishlist-item[data-productid="63"]`.
2. Clicking "Add to wishlist" on the SAME product AGAIN → `POST /addproducttocart/details/63/2` fires again, returns 200, shows the SAME success bar notification ("The product has been added to your wishlist") again, and the header count goes `(1)` → `(2)`.
3. But the Wishlist grid (`/korean-wishlist`) still shows exactly **1** product card/row for product 63 — confirmed by counting `button.wishlist-remove-btn` (returned 1, not 2) and by inspecting the raw HTML (one `article.wishlist-item[data-productid="63"]` block, one `Remove` button referencing one `wishlistItemId`).
4. **Conclusion: the header's `span.wishlist-qty` counts total "add" actions/requests, not distinct items in the wishlist.** It does not decrement or correct itself except via explicit Remove actions. A customer who clicks the same wishlist button twice sees "Wishlist (2)" in the header while the actual wishlist page shows only 1 product.
5. This directly contradicts the plain-language reading of REQ-06 ("wishlist count in header should update") — the count updates, but not to a value that matches the customer's actual saved-items count once duplicates are attempted.

**Action:** This is flagged for the product owner, not silently fixed in test design. Until answered:
- `TC-014` and `TC-017`/`TC-018` in `testcases/wishlist-management.tc.json` are updated to assert the OBSERVED behavior (count increments even on a repeat add; grid stays deduplicated) rather than the previously-assumed "TBD" placeholder.
- Test automation (Stage 5) should NOT assert `header count == number of visible product cards` as a general invariant for this feature — only assert exact counts for scenarios that never repeat-add the same product.
- If the owner confirms this is unintended, it should be filed as a `REAL_BUG` per the Stage 6 error taxonomy (do not self-heal a genuine business-logic defect) rather than adjusted away in test expectations.

---

## D-012 — Wishlist Grid Uses Infinite-Scroll Pagination (20-Item Initial Page) — 2026-08-21

- **Answered At:** `2026-08-21T20:00:00Z`
- **Answered By:** owner (discovered via TC-009 boundary test execution, then confirmed live)
- **Applied To:** wishlist-management (REQ-03, TC-009)

**Question:** TC-009 (20+ items) consistently rendered only 20 `article.wishlist-item` cards instead of 21, across multiple independent live runs — is this a bug or expected pagination?

**Answer:**
Confirmed live: the Wishlist grid initially renders a maximum of 20 items and sets
`.wishlist-has-more[data-has-more="true"]` when more exist. Scrolling to the bottom
of the page triggers an AJAX load of the remaining items (confirmed: count went
20 → 21 after `window.scrollTo(0, document.body.scrollHeight)` + AJAX settle).
This is real infinite-scroll pagination, not a defect — `pages/wishlist.page.ts`'s
`loadAllWishlistItems()` scrolls until `data-has-more` clears, and `TC-009` calls it
before asserting the full count. Codegen for any future feature touching the
Wishlist grid with >20 items must do the same.

---

<!-- New decisions appended here by agents after owner answers questions -->
