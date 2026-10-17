# TrueMargin — Architecture & Engineering Rules

## Project Overview
TrueMargin is a high-speed, ad-free SaaS calculator and catalog auditor for Etsy and TikTok Shop sellers designed to compute exact net profits and detect cash-bleeding SKUs caused by hidden, multi-tiered marketplace fees.

## Tech Stack
- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts (Waterfall breakdown charts)
- **CSV Parsing:** PapaParse
- **PDF Generation:** jsPDF + jspdf-autotable
- **Backend & Auth:** Supabase (Auth + PostgreSQL)

## Core Architectural Rules

### 1. 100% Deterministic Client-Side Fee Engine
- All marketplace calculations must reside in `src/lib/calculations.ts`.
- Pure functions, no side-effects, unit-testable.
- Round to 2 decimal places using `round2` at the output boundary to prevent floating-point drift.
- **Etsy Fee Stack:**
  - Listing fee: $0.20 per item
  - Transaction fee: 6.5% of (Item Selling Price + Shipping Charged)
  - Payment processing fee: 3.0% of (Item Selling Price + Shipping Charged) + $0.25
  - Offsite ads fee: 0%, 12%, or 15% of Item Selling Price (capped strictly at $100 per transaction)
- **TikTok Shop Fee Stack:**
  - Base referral fee: 6.0% of Selling Price
  - Creator affiliate commission: seller-configured % of Selling Price
  - Payment processing fee: 2.9% of Selling Price + $0.30
  - Ad spend / CAC: flat dollar amount per sale
  - Return / damage buffer: % of Selling Price lost to returns
- **Reverse Solver:**
  - Solves for minimum selling price given target net margin % and all cost parameters.
  - Takes into account the $100 offsite ads cap when applicable.

### 2. Component Design & State
- All page routes live in `src/app/`.
- Modular UI components live in `src/components/`.
- Mathematical calculations live in `src/lib/calculations.ts`.
- Derived values (fees, net profit, margins) are computed via pure functions and memoized with `useMemo`.
- Red accents (`#ef4444`, `text-red-400`, `bg-red-950/30`) indicate negative net profit / bleeding margins.
- Green accents (`#10b981`, `text-emerald-400`) indicate positive profits.

### 3. Hydration & Client Boundaries
- Components utilizing browser APIs or chart drawing (`Recharts`, `PapaParse`, `jsPDF`) must be marked `"use client"` and include mount guards to prevent SSR hydration mismatches in Next.js 15 / React 19.

### 4. Zero Error Policy
- Strict TypeScript: no unhandled `any` types.
- Every commit or phase must pass `npm run build` with zero errors.
