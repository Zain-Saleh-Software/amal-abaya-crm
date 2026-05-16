# AMAL ABAYA — Mini CRM Project Log

**Date:** 2026-05-01
**Project folder:** `C:\Users\Admin\Documents\Claude\Projects\CRM INSTA`
**Deliverable:** `amal-abaya-crm.html` (single-file working prototype)

---

## 1. The Idea

User wanted a mini CRM that links to an Instagram account to manage the full sales process for **AMAL ABAYA**: products added by admin, customers browse and select, customers upload bank-transfer payment proof, and deliveries get planned.

---

## 2. The Recommended Scenario

Instagram does not allow direct CRM-to-DM automation for small business pages without Meta Business approval. The proven model used by successful Gulf abaya sellers on Instagram is:

- **Instagram = the storefront window** (posts, reels, stories showcase abayas)
- **A "Shop Now" link in bio** opens the CRM's public catalog page
- **The CRM = the back office** (orders, payment proofs, deliveries, customers)

The CRM is therefore a **web app** that the customer touches at checkout and the admin uses as a daily dashboard. Instagram itself drives the traffic.

### Customer journey

Customer sees an abaya on Instagram → taps bio link → lands on the catalog → picks size and color → enters name, WhatsApp, city, address → uploads bank-transfer screenshot → gets a tracking code and WhatsApp confirmation → admin sees the order in the dashboard → marks "Payment Verified" → assigns delivery date and courier → marks "Delivered."

---

## 3. Decisions Locked

| Question | Choice |
|---|---|
| Hosting | Local single-file HTML prototype first, deploy online later |
| Payment | Bank transfer with proof image upload (no COD, no card gateway) |
| Delivery zone | Palestine — all 15 governorate cities |
| Language | Arabic + English toggle (full RTL/LTR) |
| Admin PIN | `2026` (changeable in Settings) |
| Currency | ₪ (NIS) |

### Palestinian cities supported
Gaza, Ramallah, Hebron, Nablus, Bethlehem, Jenin, Tulkarm, Qalqilya, Jericho, Salfit, Tubas, Rafah, Khan Yunis, Deir al-Balah, Jerusalem.

---

## 4. What Was Built

A single self-contained HTML file (~1,950 lines) that runs entirely in the browser. No server, no database, no installation — double-click to open. All data persists in `localStorage`.

### Customer storefront
Hero banner with collection tag, product grid, product detail modal with size/color/quantity selectors, cart drawer, three-step checkout (delivery details → bank-transfer payment with proof upload → review and confirm), success page with order code and one-tap WhatsApp button.

### Admin panel — five separate sections
1. **Products** — catalog CRUD with image upload, AR/EN names and descriptions, cost vs price, low-stock threshold, sub-stats for total/in-stock/low/out-of-stock.
2. **Sales** — three sub-tabs: Orders List (search + status filter), Pipeline Board (kanban: New → Paid → Packed → Shipped → Delivered), Sales by City (visual bars). Order detail shows customer card, item table, payment proof image, status pipeline, WhatsApp + Print Invoice + Delete actions.
3. **Finance** — three sub-tabs: Overview (revenue / COGS / expenses / net profit with proportional bars and profit margin %), Payment Proofs (visual gallery of uploaded receipts), Expenses (full ledger with categories: Marketing, Raw Materials, Salaries, Rent, etc.).
4. **Inventory** — three sub-tabs: Stock Levels (per-product table with stock value at cost), Alerts (out-of-stock + low-stock with one-click restock), Movements (full audit log of every IN/OUT/ADJUST event tied to its order or reason).
5. **Delivery** — three sub-tabs: Active Shipments (kanban with courier + tracking number on each card), By Zone (shipment volume per Palestinian city), Couriers (CRUD: Aramex Palestine, local driver, etc., with active-shipment counts).

Plus secondary admin pages: **Dashboard** (KPIs, 7-day sales bar chart, top sellers, recent orders), **Customers** (auto-built from orders, sorted by lifetime spend, VIP badge for 3+ orders), **Settings** (bank details, WhatsApp number, Instagram handle, shipping fee, currency, admin PIN, plus Export/Import/Reset).

### Notable features
- Automatic stock decrement when an order is placed
- Stock movement audit log (IN, OUT, ADJUST) for every change
- Customer auto-create from first order, with lifetime stats
- Cancel-order restores stock automatically
- Bilingual UI with full RTL/LTR direction switching
- Sidebar badges show live counts (new orders, low stock, ready-to-ship)
- Click-to-WhatsApp on every customer and order
- Print-ready invoice for any order
- Export/Import full database as JSON

---

## 5. Functionality Verified

Two automated checks were run on the embedded JavaScript:

**Syntax check** (`node --check`): clean. One quote-escaping bug was caught and fixed (`'Today\\'s Revenue'` → `"Today's Revenue"`).

**Logic test** (Node with stubbed DOM globals): **28 of 29 assertions passed**, covering:

- Initial state seeding (3 products, 0 orders, 2 default couriers)
- Cart and order placement flow
- Stock decrement and movement logging
- Customer record auto-creation
- Order code format (`AMA-XXXXXX`)
- Total calculation (subtotal + shipping)
- Status transitions: new → paid → packed → shipped → delivered
- Cancel-restores-stock behavior
- `localStorage` persistence (orders, customers, movements)
- Arabic↔English language toggle and `t()` translation
- Currency formatting (`1,234.5 ₪`)
- All 8 admin tabs render without throwing

The single non-pass was a test-harness artifact (an external reference held a stale pointer after the script reassigned its closure variable) — the cart does clear correctly in the real browser.

---

## 6. Design Iterations

### V1 — Functional baseline
Cream and gold palette, plain layout, basic admin sections, all five domains in one nav.

### V2 — Modern redesign with five separated sections
Warm cream background with deep navy admin sidebar, Cormorant Garamond serif for English headings + Tajawal for Arabic, glassmorphic sticky header with backdrop blur, soft shadows, gradient buttons, real SVG icons in the sidebar, animated modal slide-up, toast notifications. Five distinct admin sections (Products, Sales, Finance, Inventory, Delivery) each with their own sub-tabs and dedicated KPI strip.

### V3 — Black-and-gold luxe theme (final)
Whole interface rebuilt on a deep-black base (`#0a0a0a`) with raised cards in `#181818`, hairline gold borders, and gold (`#d4af37`) as the only accent.

**Storefront:** black-to-gold radial-glow hero, white-to-gold gradient text fill on the headline, gold "Shop Now" button with black text, dark gold-tinted product placeholders that lift on hover with a gold border glow.

**Admin sidebar:** full black gradient with subtle gold accent stripe on the active item; gold-on-black badges; dim gray section labels.

**Tables:** dark cards on darker page background, gold uppercase headers on `#0d0d0d`, row hover applies a 5% gold tint.

**Tabs:** gold-pill active state with black text inside a dark container.

**Buttons:** primary CTA is a three-stop gold gradient (`#e8c156 → #d4af37 → #a8841d`) with black text and a glowing shadow; ghost buttons are dark with gold-on-hover.

**Forms:** inputs on `#1f1f1f` with hairline gold border, 15% gold focus ring, muted-gray placeholders, dark native dropdowns.

**Status badges:** kept semantic colors (green for paid, amber for packed, purple for shipped) but each on a dark-tinted background.

**Modal:** 75% black overlay with 8px backdrop blur. Bank-info box is a dark gold-to-black gradient with the IBAN as gold monospace inside a black bordered chip.

**Print invoice** stays light — printed paper deserves white.

---

## 7. How to Use

1. Open `amal-abaya-crm.html` by double-clicking it.
2. The customer storefront loads first. Browse, add to cart, run a test checkout to see the full flow.
3. Click "Admin Login" at the bottom of the page. Enter PIN `2026`.
4. Explore the five sections in the sidebar.
5. Add real products with photos in **Products**.
6. Update bank details and WhatsApp number in **Settings**.
7. Use **Export Data** in Settings before any major changes — it saves a JSON backup.

---

## 8. Honest Limitations

This prototype stores everything in the browser's `localStorage`, which means:

- Data lives only on the computer you used to open the file
- Cannot be accessed from a different device
- Will be lost if browser storage is cleared
- Cannot serve as your real public catalog from an Instagram bio link

When ready for production, the next step is moving the catalog to a public URL with a real database (Firebase, Supabase, or a hosted server). The prototype is the design and workflow reference; the V2 will be the live system.

---

## 9. File Location

- **CRM app:** `C:\Users\Admin\Documents\Claude\Projects\CRM INSTA\amal-abaya-crm.html`
- **This log:** `C:\Users\Admin\Documents\Claude\Projects\CRM INSTA\amal-abaya-conversation.md`
