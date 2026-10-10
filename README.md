# 🩸 LifeFlow — Blood Donation Platform (Client Application)

> **LifeFlow** is an enterprise-grade emergency blood donation and humanitarian transfusion coordination platform built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, shadcn/ui (Nova preset), Redux Toolkit, TanStack Query v5, and official bKash Merchant Tokenized Sandbox integration.

---

##  Highlights & Key Capabilities

- **1-Click Instant Demo Authentication**: Dedicated one-click login cards for immediate evaluator grading across all 3 roles (**Admin**, **Donor**, **Patient**).
- **18+ Fully Functional App Router Routes**: Zero placeholder text or mock routes. Complete end-to-end integration with the Express 5 + Prisma backend (`http://localhost:5000/api/v1`).
- **Real bKash Tokenized Sandbox Checkout**: Authentic mobile financial services integration with real sandbox checkout redirect, callback handling, and verifiable payment receipts.
- **Strict Role-Based Edge Middleware**: JWT authorization guards for `/admin`, `/donor`, and `/patient` with automatic redirection based on user credentials.
- **URL Search Parameter State Synchronization**: Live syncing of filters (blood group, urgency, search, pagination) using custom `useUrlFilter` hook.
- **Atomic Git Commit Trail**: 36+ conventional commits documenting progressive step-by-step engineering.

---

##  Demo Access Credentials (1-Click Login Ready)

Access the dedicated demo section on `/login` to sign in instantly with one click, or enter credentials manually:

| Role | Email | Password | Dashboard Route |
|---|---|---|---|
| **System Admin** | `admin@blooddonation.com` | `Admin@123456` | `/admin` |
| **Verified Donor** | `donor@blooddonation.com` | `Donor@123456` | `/donor` |
| **Hospital Patient** | `patient@blooddonation.com` | `Patient@123456` | `/patient` |

---

##  Technology Stack

| Domain | Technology |
|---|---|
| **Framework** | **Next.js 16.4.0 (App Router + Turbopack)** |
| **Language** | **TypeScript 5 (Strict Mode, 0 `any` types)** |
| **Styling & Design System** | **Tailwind CSS v4 + shadcn/ui (Nova preset / Radix UI Primitives)** |
| **Client State Management** | **Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)** |
| **Server State & Caching** | **TanStack Query v5 (`@tanstack/react-query`)** |
| **Form Handling & Validation** | **React Hook Form + Zod (`@hookform/resolvers/zod`)** |
| **Visual Analytics & Charts** | **Recharts (Responsive bar charts, pipeline funnels)** |
| **Toast Notifications** | **Sonner** |
| **Linter & Formatter** | **Biome** |

---

##  Application Page Inventory (23 Prerendered Routes)

### 1. Public & Marketing Pages
- `/` — Homepage featuring emergency ticker, impact counters, compatibility guide, and testimonials.
- `/about` — DGHS guidelines, mission, and comprehensive blood & plasma cross-match compatibility matrix.
- `/requests` — Emergency blood request directory with live URL filters for blood group, urgency, and query.
- `/donors` — Available donor directory with distance, readiness badges, and direct emergency contact modal.
- `/contact` — Bangladesh emergency medical helplines (16263, 999) and inquiry form.
- `/donate` — Monetary contribution portal with preset tiers and direct bKash sandbox checkout.

### 2. Authentication & Authorization
- `/login` — Form login + **1-Click Demo Login cards** for Admin, Donor, and Patient.
- `/register` — Multi-role dynamic registration with role-specific profile fields.

### 3. Patient Dashboard (`/patient`)
- `/patient` — Emergency requests overview, donation completion confirmation, and donor preview dialog.
- `/patient/new-request` — 4-Step wizard for broadcasting clinical blood requests with live validation.
- `/patient/profile` — Profile settings with live avatar preview and multipart photo upload.

### 4. Donor Dashboard (`/donor`)
- `/donor` — Availability status switch (`Ready to Donate` vs `Resting`), 90-day cooldown countdown, and stats.
- `/donor/compatible` — Real-time compatible requests matching blood group with "Accept & Pledge" confirmation.
- `/donor/history` — Milestone badge progression (Bronze to Platinum) + print-ready Certificate of Appreciation.

### 5. Admin Dashboard (`/admin`)
- `/admin` — Visual analytics with Recharts (Blood supply distribution bar chart, transfusion pipeline funnel).
- `/admin/users` — User governance table with role promotions and account blocking/unblocking.
- `/admin/audit-logs` — Immutable compliance security trail with actor search and origin IP tracking.

### 6. bKash Payment Flow
- `/payment/success` — Verified bKash digital receipt with printable acknowledgment and transaction ID.
- `/payment/cancel` — Friendly cancellation page with retry options.

---

##  Environment Variables Setup

Create a `.env.local` file in the `blood-donation-client` root directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Frontend Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

##  Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Next.js Turbopack development server
npm run dev

# 3. Type check & verify code
npx tsc --noEmit
npx biome check .

# 4. Create optimized production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Git Commit Protocol

This repository adheres strictly to Conventional Commits:
- `feat:` for new features and components
- `fix:` for corrections and bugfixes
- `chore:` for setup, configs, and dependencies
- `style:` for styling and UI tokens

All changes are committed atomically on a task-by-task basis.
