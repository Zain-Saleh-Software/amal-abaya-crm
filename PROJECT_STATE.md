# AMAL ABAYA — Project Handover

_Updated 2026-05-16. Use this doc to brief a new Claude session._

## TL;DR

A bilingual (EN/AR) storefront + admin CRM for **AMAL ABAYA**, a Palestinian abaya brand. Built as a static HTML/CSS/JS site, hosted on **GitHub Pages**, backed by **Firebase Firestore + Auth**. No server, no build step, no paid services — everything runs on Firebase's free Spark plan.

- **Live site:** https://zain-saleh-software.github.io/amal-abaya-crm/
- **Repo:** https://github.com/Zain-Saleh-Software/amal-abaya-crm
- **Firebase console:** https://console.firebase.google.com/u/0/project/amal-abaya

## What's done

1. Project scaffolded — bilingual storefront + 8-section admin (Dashboard, Products, Sales, Finance, Inventory, Delivery, Customers, Settings)
2. Firebase backend wired — Firestore for data, Auth for admin login (email/password) + anonymous shoppers
3. Hi-fi black-and-gold redesign — Playfair Display + Inter for Latin, Markazi Text + Tajawal for Arabic; refined header, hero, product cards, admin sidebar, KPI cards
4. Arabic / RTL refinements — fixed header layout, dropped italic/letter-spacing on Arabic, added proper script font, flipped CTA arrows in RTL
5. No-Storage architecture — Firebase Storage requires Blaze (paid) plan for new projects, so all images (product photos + payment-proof screenshots) are compressed client-side to ~700 KB JPEG and embedded as base64 data URLs directly in Firestore docs. See `assets/js/image-utils.js`.
6. Live deployment — GitHub Pages configured to deploy from main branch (no GitHub Action; the PAT lacked `workflow` scope)

## Firebase setup completed by user

- Email/Password sign-in: enabled
- Anonymous sign-in: enabled
- Admin user: `admin@amal-abaya.local` (password chosen by user; reset in Firebase Console -> Auth -> Users if needed)
- Firestore database: created in `nam5 (us-central)` region, production mode
- Firestore rules: pasted from `firebase/firestore.rules` and published
- Storage: skipped (intentional — base64 in Firestore instead)
- Authorized domains: `zain-saleh-software.github.io` — confirm with user if Admin Login fails

## Known issues / open follow-ups

- **First test order had subtotal = 0** because the product was added with price=0. User needs to edit that product in admin -> Products -> set real price.
- **Mount truncation:** the Cowork Write/Edit tools silently truncate files >~48 KB. Always use `cat > ... <<MARKER ...` heredocs via bash for large writes and verify with `wc -c` + `tail -3`. This caused multiple bugs during initial development. See `feedback_file_writes.md` in Claude memory.
- **PAT cannot push to `.github/workflows/`** — if a new GitHub Action is needed, the user must regenerate the PAT with `workflow` scope.

## Code structure

```
amal-abaya-crm/
├── index.html                       Single entry point
├── assets/
│   ├── css/styles.css              Hi-fi black and gold theme
│   └── js/
│       ├── firebase-config.js      Web SDK config (public, safe to commit)
│       ├── firebase-client.js      Firestore/Auth wrappers, placeOrder()
│       ├── i18n.js                 EN + AR translations, RTL toggle
│       ├── image-utils.js          Canvas-based JPEG compressor
│       ├── storefront.js           Customer-facing UI (hero, products, cart, checkout)
│       ├── admin.js                8-section admin panel
│       └── app.js                  Hash router + failsafe
├── firebase/
│   ├── firestore.rules             Paste this into Firebase Console
│   └── storage.rules               Unused (we do not use Storage)
├── README.md                       User-facing setup guide
├── LICENSE                         MIT
└── PROJECT_STATE.md                This file
```

## How to deploy a change (the safe way)

1. Work in `/tmp/amal` — a Linux-native git clone of the repo. Never edit via the mount and expect large writes to survive.
2. Edit files via `cat > path <<MARKER ... MARKER` heredoc in bash.
3. Verify: `node --check path/to/file.js`, `wc -c path`, `tail -3 path`.
4. `git add -A && git commit -m "..." && git push origin main` from `/tmp/amal`.
5. Wait ~25 seconds, then fetch the live URL and `tail -3` to confirm it ends correctly.

GitHub Pages auto-rebuilds on every push to `main` (~25-45 seconds).

## Firestore rules summary

- `products`, `settings`: public read; admin write
- `orders`: anyone signed in (incl. anonymous) can CREATE (with required fields); only admin can read/update/delete
- `customers`: anyone can CREATE; only admin can list/read
- `expenses`, `couriers`: admin only
- `movements`: admin read/write + anyone signed in can CREATE (so order placement can log stock movements)

Important: the customer dedupe is now done client-side in admin (`renderCustomers` -> `dedupedCustomers`) because the rules do not let anonymous shoppers query the customers collection.

## Commit history (most recent first)

- `80adffd` — Arabic / RTL polish: proper script font, no italic-on-Arabic, fix header
- `8186c05` — Fix order placement: remove customer fetch (rules violation)
- `246f3e2` — Hi-fi redesign: Playfair Display + Inter, refined black and gold
- `95fe254` — Fix: restore truncated tail of storefront.js
- `a0a02ae` — Fix: complete truncated admin.js + firebase-client.js, surface real Firebase auth errors
- `6111aaf` — Fix: re-add truncated app.js script tag in index.html
- `83c24a9` — Fix: page no longer appears blank while fonts/auth load
- `8dd096a` — Switch image uploads to base64-in-Firestore (no Storage required)
- `696ea7d` — Initial commit
