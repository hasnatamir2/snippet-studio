# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start both frontend and backend concurrently (recommended for development)
npm run dev

# Run individually
npm run dev:frontend   # Next.js with Turbopack
npm run dev:backend    # Convex dev server

# Build and lint
npm run build
npm run lint
```

There are no test commands configured in this project.

## Architecture Overview

Snippet Studio is a code snippet sharing app with a freemium model. The stack is:

- **Frontend**: Next.js 15 (App Router) with Tailwind CSS v4 and shadcn/ui components
- **Backend/Database**: Convex (real-time, serverless)
- **Auth**: Clerk
- **Payments**: Stripe

### Auth & User Sync

Clerk handles authentication. On sign-in, the client-side `ConvexUserBootstrapper` component (`src/components/convex/convex-user-bootstrapper.tsx`) calls the `ensureUser` mutation to upsert the Clerk user into Convex's `users` table. The Clerk user ID (`clerkId`) is the join key between Clerk and Convex.

Middleware (`src/middleware.ts`) uses `clerkMiddleware()` which applies globally — there are no protected route guards in middleware; access control is enforced at the Convex query/mutation level.

### Convex Backend (`convex/`)

All backend logic lives in `convex/`. The generated API types in `convex/_generated/` are auto-created by `convex dev` — never edit them manually.

- **`convex/schema.ts`** — Defines all tables: `users`, `snippets`, `snippetShares`, `plans`, `auditLogs`
- **`convex/queries/`** — Read-only queries (`user.ts`, `snippets.ts`). Internal queries (prefixed with `_` or using `internalQuery`) are only callable from other Convex functions, not from the client.
- **`convex/mutations/`** — Write operations (`snippet.ts`, `users.ts`). Internal mutations use `internalMutation`.
- **`convex/actions/stripe.ts`** — Stripe integration. Uses `"use node"` directive at the top (required for the Stripe SDK, which needs the Node.js runtime).

Convex functions are imported on the client via the generated `api` object:
```ts
import { api } from "../../../convex/_generated/api";
// Internal functions use `internal` instead of `api`
import { internal } from "../_generated/api";
```

### Subscription & Billing Flow

Free plan is limited to 9 snippets (`MAX_FREE_SNIPPETS` in `src/lib/constant.ts`). Pro plan is unlimited.

Two subscription paths exist:
1. **Checkout redirect** (`createCheckout` action) — Creates a Stripe Checkout session and redirects the user.
2. **Manual/embedded** (`createSubscription` action + `src/app/billing/payment/page.tsx`) — Creates a subscription with `payment_behavior: "default_incomplete"`, returns a `clientSecret` for the Stripe `PaymentElement`, then finalizes via `finalizeSubscription` action after setup.

Stripe webhooks arrive at `src/app/api/stripe/webhook/route.ts`, which forwards the raw body to the `convex/actions/stripe.ts` `webhook` action. The webhook handler updates user subscription status via internal mutations.

The API route at `src/app/api/stripe/cancel/route.ts` handles subscription cancellation (sets `cancel_at_period_end: true`).

### Key Conventions

- All Convex mutations that write snippets also insert an `auditLogs` entry.
- The `snippets` table enforces the free-tier limit inside the `createSnippet` mutation (not client-side).
- Snippet ownership checks (for update/delete/toggle) compare `snippet.userId` against the user's Convex `_id`, not their Clerk ID.
- `isPublic` snippets are readable by anyone (unauthenticated) via `getSnippetById`; private snippets require ownership.
- The `SnippetModule` component (`src/components/snippets/snippet-form.tsx`) handles both create and edit modes based on whether a `snippet` prop is passed.
- Language auto-detection uses `highlight.js` when no language is explicitly set.

## Important

When you find a security vulnerability, flag it immediately with a WARNING comment and suggest a secure alternative. Never implement insecure patterns even if asked.