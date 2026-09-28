# Tea Billing App

## What this is
A small, offline-first, mobile-first web app (PWA) for my father, a tea seller. He delivers tea and small snacks to offices, shops and companies. He records deliveries daily and bills each customer weekly or every two weeks. Today he does this on paper; this app replaces the paper.

The only user is one non-technical person on an Android phone, often with poor or no internet. Simplicity and speed matter more than features.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- Dexie (IndexedDB) for local storage
- vite-plugin-pwa for install and offline support
- React Router for navigation
- Deploy to Vercel or Netlify (static)
- No backend for now. Do not add one unless I ask.
- Ask before adding any new dependency.

## Core rules
- Mobile-first. Design for a ~380px wide screen first, then scale up.
- Big tap targets (min 44px), large readable text, high contrast, one-handed use.
- Must work fully offline after the first load.
- Currency is Indian Rupees (₹). Format with Indian grouping (e.g. ₹1,25,000) using `Intl.NumberFormat('en-IN')`.
- No GST or tax handling unless I ask.
- Dates are shown as DD/MM/YYYY, stored as ISO `YYYY-MM-DD` strings. Use local time, never UTC conversion that shifts the day.
- Never lose data. Any delete of a customer or bill needs a confirmation. Keep the backup feature working.
- Keep the UI very simple. No jargon, no nested menus. Prefer fewer screens and fewer clicks.
- Money is stored as integers in paise (₹1 = 100) or as numbers rounded to 2 decimals. Never show floating-point errors.

## Data model (Dexie tables)
- **Customer**: id, name, phone?, address?, notes?, createdAt
- **Item**: id, name, defaultPrice, active
- **CustomerPrice** (optional, phase 2): customerId, itemId, price. Overrides the item's default for that customer.
- **Entry**: id, customerId, date, itemId, itemName, unitPrice, qty, billId?
  - Copy `itemName` and `unitPrice` into the entry at the time of sale, so later price changes never alter old bills.
- **Bill**: id, number, customerId, fromDate, toDate, total, createdAt
  - Entries included in a bill get `billId` set.
- **Payment**: id, customerId, date, amount, note?

Customer balance = sum of bill totals - sum of payments.

## Screens
Bottom tab navigation with four tabs:
1. **Entry** (home): choose customer and date, +/- steppers for each item, Save. Below it, recent entries for that customer with delete. Include a "copy last entry" shortcut.
2. **Bills**: choose customer and date range (default: last 14 days), preview day-wise list + item summary + total, then Save bill. List of past bills with status and balance. Record payments here.
3. **Customers**: list with outstanding balance, add/edit/delete. Tapping one shows entries, bills and payments.
4. **Settings**: manage items and prices, shop name and phone (shown on bills), backup export/import (JSON), CSV export.

## Bill output
- Print-friendly page with `@media print` CSS so it can be saved as PDF from the phone browser.
- Shows: shop name and phone, bill number, customer name, date range, day-wise table, item summary (qty, rate, amount), total, previous balance if any.
- "Share on WhatsApp" button that builds a plain-text summary and opens `https://wa.me/<phone>?text=...` (or the generic share if there is no phone).
- Bill numbers are sequential (e.g. 0001, 0002).

## Code conventions
- Functional React components with hooks; TypeScript strict mode, no `any`.
- Keep DB access in `src/db/` (Dexie schema and small query helpers). Components should not talk to Dexie directly; use hooks like `useCustomers()` (with `dexie-react-hooks`' `useLiveQuery`).
- Keep pure logic (totals, balances, date ranges, formatting) in `src/lib/` and write unit tests for it with Vitest.
- One component per file, small files, clear names.
- Folder layout: `src/db`, `src/lib`, `src/components`, `src/pages`, `src/hooks`.
- Use Tailwind utility classes; avoid custom CSS except the print stylesheet.

## Workflow
- Build in small phases, one at a time. After each phase, tell me what to test on my phone.
- Use Plan mode for anything touching the data model, payments, or syncing. Show the plan before coding.
- Commit to git after each working phase with a clear message.
- Run `npm run build` and `npm test` before saying a phase is done.
- If something in this file conflicts with my request, ask me before deviating.

## Phases
1. Project setup, Dexie schema, tab navigation, PWA config
2. Customers and items management
3. Daily entry screen
4. Bill generation, save, print, WhatsApp text
5. Payments and balances, home summary
6. Backup/restore and CSV export
7. Polish: install icon, offline test, PIN lock, optional Malayalam labels
8. (Optional) Cloud sync with Supabase, only if needed

## Out of scope for now
User accounts, multiple shops, inventory/stock tracking, GST invoices, online payments, and any server backend.
