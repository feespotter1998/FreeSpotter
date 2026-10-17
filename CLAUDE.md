# TrueMargin — Architecture Rules

## Project Overview
TrueMargin is a marketplace seller profit calculator & audit SaaS for Etsy and TikTok Shop sellers.

## Tech Stack
- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts (Waterfall breakdown charts)
- **CSV Parsing:** PapaParse
- **PDF Generation:** jsPDF + jspdf-autotable
- **Backend & Auth:** Supabase (Auth + PostgreSQL)

## Architectural Rules

### 1. Calculations Must Be Client-Side & Deterministic
- All fee calculations live in `src/lib/calculations.ts`.
- No server-side math. Every formula is pure, deterministic, and testable.
- Never use floating-point-unsafe operations for currency. Round to 2 decimal places at the output boundary.

### 2. Fee Formula Accuracy
- **Etsy fees:** Listing ($0.20), Transaction (6.5% of item+shipping), Payment Processing (3%+$0.25), Offsite Ads (0%/12%/15% with $100 cap).
- **TikTok fees:** Base referral (6%), Creator Affiliate (custom %), Payment Processing (2.9%+$0.30), Ad Spend, Return buffer.
- These formulas are the single source of truth. UI components consume results; they never recompute.

### 3. Component Structure
- Page components go in `src/app/`.
- Reusable UI components go in `src/components/`.
- Business logic (calculations, types) goes in `src/lib/`.
- Supabase client and helpers go in `src/lib/supabase/`.

### 4. Styling
- Use Tailwind CSS utility classes exclusively.
- Dark-first design with clean, modern aesthetic.
- Red accent for negative margins / cash-bleeding SKUs.
- Green accent for healthy margins.

### 5. State Management
- Use React `useState` and `useMemo` for calculator state.
- No external state management library needed.
- Derived values (fees, profit, margin) are always computed from source inputs.

### 6. TypeScript
- Strict mode enabled.
- All function parameters and return types explicitly typed.
- No `any` types.
- Interfaces for all data structures in `src/lib/calculations.ts`.

### 7. File Naming
- Components: PascalCase (e.g., `CalculatorDashboard.tsx`)
- Utilities/libs: camelCase (e.g., `calculations.ts`)
- Pages: Next.js App Router conventions (`page.tsx`, `layout.tsx`)
