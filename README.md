# Sika Pakistan — E-Commerce Platform

A direct-to-customer e-commerce platform for Sika Pakistan, built to sell construction chemicals and related products to both retail customers and B2B contractors, with dedicated admin tooling for order and catalog management.

> **⚠️ Project Status: Under Active Development**
> This project is **not complete** and is not yet live to the public. Core commerce flows (browsing, cart, checkout, accounts, order management) are functional and have been through multiple rounds of security and correctness review. Several pieces — most notably real payment gateway integration — are still pending. See [Known Limitations](#known-limitations--whats-not-done-yet) before assuming any part of this is production-ready.

---

## Overview

The platform serves two kinds of buyers from one storefront:

- **Retail customers** — browse and buy at standard pricing.
- **B2B / contractor accounts** — apply for verified business status (NTN + business documents, reviewed by an admin) and unlock automatic volume-based tiered pricing once approved.

Staff access is split into two tiers:

- **Admin** — day-to-day operations: manage orders, manage the product catalog, review B2B applications.
- **Super Admin** — everything an Admin can do, plus the ability to create/manage other staff accounts and delete orders (soft-delete only, and only for orders that never became a real transaction).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, Radix UI / shadcn |
| Database | PostgreSQL via [Supabase](https://supabase.com) |
| ORM | [Prisma 7](https://www.prisma.io) with `@prisma/adapter-pg` |
| Auth | [NextAuth (Auth.js) v5](https://authjs.dev) — credentials-based, edge/Node split architecture |
| Rate limiting | [Upstash Redis](https://upstash.com) + `@upstash/ratelimit` (sliding window) |
| Email | [Resend](https://resend.com) |
| PDF generation | `@react-pdf/renderer` (order receipts) |
| Validation | [Zod](https://zod.dev) |
| Testing | [Playwright](https://playwright.dev) (end-to-end) |
| Hosting | [Vercel](https://vercel.com) |

**Note on NextAuth v5:** this project currently runs on a beta release, pinned to an exact version (no `^` range) to prevent unannounced upgrades. This was a deliberate, documented tradeoff to get hands-on experience with the modern edge/Node auth split — see the code comments in `src/auth.config.ts` for specific gotchas this project has already hit and fixed.

---

## Key Features

### Storefront (customer-facing)
- Product browsing by category and by "application area" (e.g. Waterproofing, Tiling, Concrete Repair)
- Product search with pagination and filtering
- Persistent, database-backed shopping cart (survives across sessions/devices)
- Automatic tiered/bulk pricing for approved B2B accounts
- Full checkout flow with server-side price recalculation (never trusts client-submitted prices)
- Order confirmation emails and downloadable PDF receipts
- Customer order history with cancellation (for orders that haven't shipped)
- Contact form (rate-limited, sends real email via Resend)
- Static informational pages: About, FAQ, Delivery, Privacy, Terms, Cookies, Disclaimer

### Accounts & Access
- Email/password signup and login
- Four-tier role system: `CUSTOMER`, `B2B`, `ADMIN`, `SUPER_ADMIN`
- B2B application flow: business documents submitted at signup (or later) go into a `PENDING` queue — B2B pricing is **never** self-granted, only unlocked after admin review and approval
- Layered authorization: edge middleware → route layout → page-level checks → server-action-level checks (deliberately redundant, not relying on any single layer)

### Admin
- Order management: search, filter by status/customer type/date range, update fulfillment status, edit shipping details before dispatch
- Order deletion restricted to Super Admin, soft-delete only, and only for orders still `PENDING` or `CANCELLED` — a shipped/paid order is a financial record and is never hard-deleted
- Full product catalog management: create/edit/archive products, set tiered pricing, toggle stock status and featured placement
- B2B application review and approval/rejection
- Super Admin–only staff management: create admin accounts, promote/demote roles, remove staff (with safeguards against self-demotion/self-deletion)

---

## Architecture Notes

A few decisions worth knowing about if you're picking this codebase up:

- **Prices are never trusted from the client.** Every price shown in an order (cart, checkout, admin edits) is recalculated server-side from the current tiered pricing table at the moment of the write, inside the same database transaction as the write itself.
- **State-changing mutations use compare-and-swap, not read-then-write.** Anywhere an action depends on a record's current status (cancelling an order, deleting an order), the condition is enforced directly in the database write's `WHERE` clause, not checked in application code beforehand — this closes race conditions where two requests could act on stale state.
- **Decimal handling has a dedicated, tested serialization utility** (`src/lib/serialize.ts`) — Prisma's `Decimal` type does not survive naive `JSON.stringify` the way you'd expect; this project hit that bug in production display data and fixed it at the root rather than patching each call site.
- **Rate limiting fails open, not closed.** If Redis is unreachable, checkout, login, B2B submissions, and the contact form all continue to function without rate limiting rather than blocking every user — a secondary defense-in-depth layer going down should never take the whole site down with it.

---

## Known Limitations / What's Not Done Yet

Being direct about this, since the project is explicitly not finished:

- **Payment gateway integration is scaffolded, not live.** A webhook handler exists (`src/app/api/webhooks/payment/route.ts`) with proper signature verification, but it isn't yet connected to a real payment provider — that integration is blocked on Sika's merchant account application, which is an external, non-technical dependency outside this repo's control.
- **The product catalog is not fully populated.** Seed data covers a representative sample, not Sika's full product range, and final product photography has not been uploaded.
- **Test coverage is partial.** Playwright e2e tests exist for the core checkout flow but do not yet cover the full surface area (admin flows, B2B application review, search/filtering).
- **No automated CI pipeline yet** — builds and tests are currently run manually before each deploy.

---

## Getting Started

### Prerequisites
- Node.js
- A PostgreSQL database (this project is built against Supabase specifically, using both a pooled and a direct connection string)
- Accounts/API keys for: Resend (email), Upstash (Redis rate limiting)

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Database (Supabase)
DATABASE_URL="postgres://...:6543/postgres?sslmode=require"   # pooled, used at runtime
DIRECT_URL="postgres://...:5432/postgres"                      # direct, used for migrations

# Auth
AUTH_SECRET="your-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email
RESEND_API_KEY="your-resend-api-key"
CONTACT_INBOX_EMAIL="information@pk.sika.com"

# Payment (scaffolded, see Known Limitations)
PAYMENT_GATEWAY_SECRET="your-payment-gateway-secret"

# Rate limiting
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-rest-token"
```

### Install & Run

```bash
npm install
npx prisma generate
npx prisma db push        # or: npx prisma migrate deploy
npx tsx prisma/seed.ts    # seeds demo categories, products, and accounts
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

(`postinstall` and `build` both run `prisma generate` automatically.)

### Tests

```bash
npx playwright test
```

---

## Project Structure

```
src/
├── app/
│   ├── (storefront pages)      # /, /products, /category/[slug], /area/[slug], /product/[slug]
│   ├── account/orders/         # customer order history
│   ├── admin/                  # admin & super admin dashboards
│   ├── b2b/status/              # B2B application status page
│   ├── cart/, checkout/        # cart & checkout flow
│   ├── login/, signup/         # auth pages
│   ├── actions/                # Server Actions (all mutations live here)
│   └── api/                    # auth handler, PDF receipts, payment webhook
├── components/                  # shared UI components
└── lib/                         # prisma client, email, rate limiting, serialization, shared query filters

prisma/
├── schema.prisma
└── seed.ts
```

---

## License

Internal project — not licensed for external use or distribution.