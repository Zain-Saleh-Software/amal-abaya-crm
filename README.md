# AMAL ABAYA — Mini CRM

A single-page CRM and storefront for **AMAL ABAYA**, a Palestinian abaya brand. Customers browse the catalog, place orders with bank-transfer proof, and the admin manages the whole pipeline from one dashboard.

- **Frontend:** static HTML/CSS/JS (no build step)
- **Backend:** Firebase (Firestore + Auth — Storage NOT needed)
- **Image handling:** Client-side compression to base64 inside Firestore docs (so the whole stack stays on the free Spark plan)
- **Hosting:** GitHub Pages (free)
- **Languages:** English + Arabic (full RTL/LTR)
- **Theme:** Black & gold

---

## Quick start

### 1. Create a Firebase project

1. Go to <https://console.firebase.google.com> and create a new project (any name, e.g. `amal-abaya`).
2. In the project dashboard, click the **Web** icon (`</>`) to register a web app. Copy the `firebaseConfig` object that's shown.
3. Enable these services from the left sidebar:
   - **Authentication** → Sign-in method → enable **Email/Password** and **Anonymous**.
   - **Firestore Database** → Create database → Start in **production mode**, pick a region (e.g. `nam5 (us-central)` or `us-east1` — these are free; europe regions also free for Firestore but now require Blaze for the default Storage bucket, which we don't use anyway).
   - **Storage:** NOT NEEDED — images are compressed client-side and embedded as base64 inside Firestore documents.

### 2. Paste your Firebase config

Copy the example config to the real filename, then paste your values:

```bash
cp assets/js/firebase-config.example.js assets/js/firebase-config.js
```

Open `assets/js/firebase-config.js` and replace each `PASTE_YOUR_*` placeholder with the matching value from Firebase.

> The Firebase **web** config values (apiKey, projectId, etc.) are **not secrets** — Firebase is designed for them to ship in the browser. Real security comes from the rules in step 3.

### 3. Deploy the security rules

In the Firebase console:

- **Firestore → Rules** → paste the contents of [`firebase/firestore.rules`](firebase/firestore.rules) → **Publish**.
- Storage rules: skip — Storage isn't used.

### 4. Create the admin user

In **Authentication → Users → Add user**, create the admin account:

- Email: `admin@amal-abaya.local` (or whatever you set as `adminEmail` in the app's Settings page later)
- Password: pick something strong. This is what you'll type into the **Admin Login** form on the storefront.

### 5. Run it locally

Because the app uses ES modules, you need a tiny static server (you can't just double-click `index.html`):

```bash
# Python (already on Mac/Linux/Windows)
python3 -m http.server 5500

# or Node
npx serve .
```

Open <http://localhost:5500>. You should see the storefront. Scroll to the bottom, click **Admin Login**, sign in with the user you just created, and start adding products.

### 6. Deploy to GitHub Pages

This repo includes a workflow at `.github/workflows/pages.yml` that auto-deploys on push to `main`. To turn it on:

1. Push the repo to GitHub (the workflow runs immediately).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Wait ~1 minute. Your live URL will appear at the top of that page: `https://<your-org-or-user>.github.io/amal-abaya-crm/`.

---

## Project structure

```
amal-abaya/
├── index.html                          # Single-page entry
├── assets/
│   ├── css/styles.css                  # Black-and-gold theme
│   └── js/
│       ├── firebase-config.example.js  # Template — copy to firebase-config.js
│       ├── firebase-config.js          # ← YOUR Firebase web config (you create this)
│       ├── firebase-client.js          # Firestore + Storage + Auth wrappers
│       ├── i18n.js                     # AR/EN translations
│       ├── storefront.js               # Customer-facing UI
│       ├── admin.js                    # 5-section admin dashboard
│       └── app.js                      # Hash router
├── firebase/
│   ├── firestore.rules                 # Paste into Firebase console
│   └── storage.rules                   # Paste into Firebase console
├── .github/workflows/pages.yml         # Auto-deploy to GitHub Pages
├── .gitignore
├── LICENSE
└── README.md
```

## What's inside

**Storefront** (everyone):
- Bilingual hero + product grid with size/color/quantity picker
- Cart drawer with quantity controls
- Three-step checkout: details → bank-transfer payment + proof upload → review
- Order success screen with order code + WhatsApp deep link

**Admin panel** (after login, at `#admin`):

| Section    | Sub-tabs                                |
| ---------- | --------------------------------------- |
| Dashboard  | KPIs, 7-day sales chart, recent orders, top sellers |
| Products   | Full CRUD with image upload, AR/EN, cost vs price, low-stock threshold |
| Sales      | Orders list · Pipeline kanban · Sales by city |
| Finance    | Overview (revenue / COGS / expenses / profit) · Payment proofs gallery · Expenses ledger |
| Inventory  | Stock levels with value-at-cost · Alerts (out + low) · Audit log of all movements |
| Delivery   | Active shipments kanban · Volume by zone · Couriers CRUD |
| Customers  | Auto-built from orders, lifetime spend, VIP badge for 3+ orders |
| Settings   | Bank details, WhatsApp number, Instagram handle, shipping fee, currency |

## How orders flow

1. Customer picks size/color/quantity → adds to cart.
2. Customer fills delivery details, transfers payment to the IBAN shown, uploads a screenshot of the transfer.
3. App writes the order to Firestore + the proof image to Storage, generates an order code (`AMA-XXXXXX`), shows a WhatsApp deep link.
4. Admin sees the new order in the **Sales** tab (live), opens it, verifies the proof image, sets status to **Paid**.
5. Admin assigns a courier and tracking number from the **Delivery** tab.
6. As status moves through *Packed → Shipped → Delivered*, customer can be messaged on WhatsApp from the order detail.

Stock is decremented automatically when the order is placed and restored if the order is cancelled. Every change is logged in **Inventory → Movements**.

## Limitations / honest notes

- **Stock concurrency:** stock decrement on order placement is best-effort, not a transaction. Under heavy concurrent traffic two customers could oversell. Fine for early-stage volume; if you grow, move `placeOrder` to a Firebase Cloud Function with a Firestore transaction.
- **Anonymous order writes:** anyone can `POST` an order doc (that's how customer checkout works). Firestore rules constrain the shape (`status: 'new'`, numeric total) but not abuse. If you start getting spam orders, enable Firebas