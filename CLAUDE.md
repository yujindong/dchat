# CLAUDE.md - DChat Codebase Guide

This document provides comprehensive guidance for AI assistants working on the **DChat** project. It covers architecture, development workflows, conventions, and best practices.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Directory Structure](#directory-structure)
4. [Development Workflow](#development-workflow)
5. [Key Conventions](#key-conventions)
6. [Database & Seeding](#database--seeding)
7. [API Endpoints](#api-endpoints)
8. [WeChat Integration](#wechat-integration)
9. [Environment Configuration](#environment-configuration)
10. [Common Tasks](#common-tasks)
11. [Code Style Guidelines](#code-style-guidelines)
12. [Testing & Quality](#testing--quality)

---

## Project Overview

**DChat** is an early-stage Next.js 14 full-stack web application designed to provide chat/communication functionality with WeChat (微信) integration.

**Current Status:** Prototype/Early Development
- Core Next.js setup complete
- PostgreSQL infrastructure scaffolded
- WeChat signature validation partially implemented
- Main UI components and features not yet implemented

**Key Features (In Progress):**
- WeChat OAuth and message validation
- PostgreSQL database integration
- User authentication with bcrypt
- Responsive UI with Tailwind CSS

---

## Tech Stack & Architecture

### Frontend Stack
- **Framework:** Next.js 14.2.6 with App Router
- **UI Library:** React 18
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4.1 + PostCSS
- **Font:** Inter (via `next/font`)

### Backend Stack
- **Runtime:** Node.js (via Next.js)
- **API Routes:** Next.js API Routes (both Pages Router `/pages/api` and App Router)
- **Database:** PostgreSQL (via Vercel Postgres SDK `@vercel/postgres`)

### Security & Utilities
- **Password Hashing:** bcrypt 5.1.1
- **Cryptographic Hashing:** sha1 1.1.1 (for WeChat signature validation)

### Development Tools
- **Package Manager:** pnpm 9.6.0 (specified in `package.json`)
- **Linting:** ESLint 8 with Next.js config
- **Type Checking:** TypeScript 5 (strict mode)

### Architecture Pattern
- **Full-stack monorepo:** Frontend and backend code coexist in single Next.js app
- **File-based routing:** Uses App Router structure (`/src/app`)
- **API routes:** Handles backend logic via `/pages/api` and App Router routes
- **Database layer:** Direct PostgreSQL queries (no ORM currently)

---

## Directory Structure

```
dchat/
├── src/
│   └── app/                          # Next.js 14 App Router
│       ├── layout.tsx                # Root layout with Inter font setup
│       ├── page.tsx                  # Home page (minimal placeholder)
│       ├── globals.css               # Global Tailwind CSS imports
│       ├── favicon.ico
│       ├── user/
│       │   └── page.tsx              # User list page (PostgreSQL query example)
│       └── seed/
│           ├── route.ts              # POST endpoint to seed database
│           └── placeholder-data.ts   # Mock data for development
│
├── pages/
│   └── api/
│       └── wxValidate.ts             # WeChat signature validation endpoint
│
├── public/                           # Static assets served by Next.js
│   ├── next.svg
│   ├── vercel.svg
│   └── MP_verify_*.txt               # WeChat verification file (domain verification)
│
├── Configuration Files:
│   ├── package.json                  # Dependencies & scripts
│   ├── pnpm-lock.yaml                # pnpm lock file
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── next.config.mjs               # Next.js configuration
│   ├── tailwind.config.ts            # Tailwind CSS configuration
│   ├── postcss.config.mjs            # PostCSS configuration
│   ├── .eslintrc.json                # ESLint rules
│   ├── .gitignore
│   └── .env                          # Environment variables (git-ignored)
│
├── README.md                         # Basic Next.js getting started guide
├── CLAUDE.md                         # This file - AI assistant guide
└── .git/                             # Git repository
```

### Key Directory Explanations

- **`/src/app`** - Next.js App Router directory structure. All pages and layouts go here.
- **`/pages/api`** - Legacy Pages Router API routes. Mix of old API endpoints here.
- **`/public`** - Static files served at root (e.g., `/MP_verify_*.txt` accessible at domain root).
- **`/src/app/seed`** - Database initialization utilities. Access via POST `/api/seed`.

---

## Development Workflow

### Initial Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repo>
   cd dchat
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env  # if it exists, or manually create .env
   ```
   Required variables:
   - `WX_TOKEN` - WeChat token for signature validation
   - `POSTGRES_URLCONNSTR` - PostgreSQL connection string (if using Vercel Postgres)

3. **Start development server:**
   ```bash
   pnpm dev
   ```
   Accessible at `http://localhost:3000`

### Daily Development Cycle

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes:**
   - Edit files in `/src/app` or `/pages/api`
   - TypeScript strict mode enforced - fix type errors
   - ESLint will warn about style issues

3. **Test locally:**
   ```bash
   pnpm dev
   # Navigate to http://localhost:3000 in browser
   ```

4. **Run linter:**
   ```bash
   pnpm lint
   ```
   Address any linting errors before committing.

5. **Commit with clear messages:**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```
   Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

6. **Push and create PR:**
   ```bash
   git push -u origin feature/your-feature-name
   ```

### Build & Deployment

```bash
pnpm build      # Creates optimized production build
pnpm start      # Starts production server
```

---

## Key Conventions

### File Naming
- **Components:** PascalCase (e.g., `UserCard.tsx`)
- **Utility files:** camelCase (e.g., `formatDate.ts`)
- **Pages:** lowercase (e.g., `page.tsx`, `layout.tsx`)
- **API routes:** lowercase with descriptive names (e.g., `wxValidate.ts`)

### TypeScript Conventions
- **Strict mode enabled** - All files must pass strict TypeScript checking
- **Export types explicitly:** Use `export type`, `export interface` for type definitions
- **Avoid `any` type** - Use proper typing or generics
- **Default exports for pages:** Pages and layouts use `export default`
- **Named exports for utilities:** Prefer named exports in utility functions

Example:
```typescript
// pages/api/example.ts
import type { NextApiRequest, NextApiResponse } from "next";

export interface ResponseData {
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: "Hello" });
}
```

### React Component Patterns
- **Use functional components** - Class components not used in this project
- **Use hooks** - `useState`, `useEffect`, `useContext` as appropriate
- **Server Components default** - In App Router, components are Server Components by default
- **Mark Client Components:** Use `"use client"` directive when needed (interactivity required)

Example:
```typescript
// src/app/components/UserCard.tsx
"use client";

import { useState } from "react";

export default function UserCard({ userId }: { userId: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 border rounded">
      <h3>{userId}</h3>
      {expanded && <p>Details...</p>}
    </div>
  );
}
```

### Tailwind CSS Usage
- **Use utility classes** - Avoid custom CSS when possible
- **Responsive prefixes:** `sm:`, `md:`, `lg:`, `xl:` for breakpoints
- **Dark mode:** Use `dark:` prefix (if dark mode configured)
- **Spacing:** Use consistent spacing scale (p-4, m-2, gap-6, etc.)

Example:
```tsx
<div className="flex flex-col gap-4 p-6 rounded-lg border shadow">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

### API Route Conventions
- **Type request/response:** Use Next.js type exports (`NextApiRequest`, `NextApiResponse`)
- **Handle multiple methods:** Use `req.method` to differentiate GET/POST/etc.
- **Validate input:** Always validate query/body parameters
- **Return JSON:** Use `res.json()` or `res.status().json()`
- **Error handling:** Always set appropriate status codes

Example:
```typescript
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "Missing required field: data" });
  }

  return res.status(200).json({ success: true });
}
```

### Import Path Aliases
Use path alias `@/` to import from `/src/`:
```typescript
// Good ✓
import { Component } from "@/app/components/Component";
import type { User } from "@/types/User";

// Avoid ✗
import { Component } from "../../../app/components/Component";
```

---

## Database & Seeding

### Database Setup

The project uses **PostgreSQL** via Vercel Postgres SDK. Connection is managed through:
- `@vercel/postgres` package
- Connection string from `POSTGRES_URLCONNSTR` environment variable

### Database Schema

Currently defined in `/src/app/seed/placeholder-data.ts` and created via `/api/seed`:

#### `users` table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

#### `customers` table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  image_url VARCHAR(255)
);
```

#### `invoices` table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  amount DECIMAL(10, 2),
  status VARCHAR(50),
  date DATE
);
```

#### `revenue` table
```sql
CREATE TABLE revenue (
  month VARCHAR(10),
  revenue DECIMAL(10, 2)
);
```

### Seeding the Database

1. **Trigger seed endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

2. **Seed script location:** `/src/app/seed/route.ts`

3. **Mock data location:** `/src/app/seed/placeholder-data.ts`

**Note:** Seeding is idempotent - running multiple times should not cause errors (tables are dropped and recreated or use INSERT IGNORE logic).

### Querying the Database

Use `@vercel/postgres` for queries:

```typescript
// src/app/user/page.tsx
import { sql } from "@vercel/postgres";

export default async function UserPage() {
  const { rows } = await sql`SELECT * FROM users;`;

  return (
    <div>
      {rows.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

**Best Practices:**
- Use parameterized queries to prevent SQL injection
- Always handle errors and loading states
- For Server Components, queries can be async directly
- For Client Components, create an API route and fetch from it

---

## API Endpoints

### Existing Endpoints

#### `GET/POST /api/wxValidate`
**Purpose:** WeChat server validation and message handling
**File:** `/pages/api/wxValidate.ts`

**Request Parameters (GET):**
- `signature` - WeChat-generated signature
- `timestamp` - Server timestamp
- `nonce` - Random string
- `echostr` - Echo string for validation

**Response:**
- If valid: Returns `echostr` parameter
- If invalid: Returns `null`

**Implementation Notes:**
- Validates signature by SHA1 hashing `[token, timestamp, nonce]` sorted array
- Token sourced from `WX_TOKEN` environment variable
- Currently GET-only; POST handler for messages needs implementation

Example validation logic:
```typescript
export function checkWeixinSignature({
  signature,
  timestamp,
  nonce,
}: WeixinSignatureParams) {
  const arr = [WX_TOKEN, timestamp, nonce].sort();
  const signStr = sha1(arr.join(""));
  return signStr === signature;
}
```

#### `POST /api/seed`
**Purpose:** Initialize/reset database with seed data
**File:** `/src/app/seed/route.ts`

**Response:**
```json
{ "success": true }
```

**Security Note:** This endpoint should be protected in production (add authentication check).

### Creating New API Endpoints

**Using Pages Router** (`/pages/api/`):
```typescript
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handler logic
}
```

**Using App Router** (`/src/app/*/route.ts`):
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: "value" });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true });
}
```

**Recommendation:** Use App Router for new endpoints as Pages Router is being phased out.

---

## WeChat Integration

### Overview
DChat includes partial WeChat (微信) integration for authentication and messaging. Currently implemented:
- Server signature validation
- Domain verification file

### Signature Validation

WeChat validates server authenticity by:
1. Sending GET request with signature, timestamp, nonce
2. Server must SHA1 hash `[token, timestamp, nonce]` (sorted)
3. Compare resulting hash to signature
4. Return `echostr` if valid

**Token Storage:**
- Token in `WX_TOKEN` environment variable
- Must match token configured in WeChat Developer Dashboard

**Verification File:**
- File `/public/MP_verify_*.txt` for domain verification
- Placed at domain root for WeChat to verify ownership

### Next Steps for WeChat Integration

1. **Implement message handling:**
   - POST handler in `/pages/api/wxValidate.ts`
   - Parse XML messages from WeChat
   - Implement message response logic

2. **Add OAuth integration:**
   - Implement WeChat OAuth 2.0 flow for user login
   - Store user info in `users` table

3. **Webhook signature validation:**
   - Extract `X-Parse-Signature` from webhook headers
   - Validate message authenticity

### Testing WeChat Integration

**Locally:** Use ngrok to expose local server to WeChat:
```bash
ngrok http 3000
# Update WeChat backend settings with ngrok URL
```

**Test signature validation:**
```bash
curl "http://localhost:3000/api/wxValidate?signature=SIGNATURE&timestamp=TIMESTAMP&nonce=NONCE&echostr=ECHOSTR"
```

---

## Environment Configuration

### Environment Variables

Create `.env.local` (git-ignored) with:

```env
# WeChat Configuration
WX_TOKEN=your_wechat_token_here

# Database Configuration (Optional - for Vercel Postgres)
POSTGRES_URLCONNSTR=postgresql://user:password@host:5432/dbname

# App Configuration
NODE_ENV=development
```

### Development vs Production

**Development (.env.local):**
- Use local database or Vercel Postgres dev instance
- Enable verbose logging
- Less strict error handling

**Production (.env):**
- Production database connection
- Verify all secrets are set
- Enable error monitoring/logging

### Accessing Environment Variables

**Server-side:**
```typescript
const wxToken = process.env.WX_TOKEN;
const dbUrl = process.env.POSTGRES_URLCONNSTR;
```

**Client-side:**
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to browser
- Never expose secrets on client-side

**Recommended:**
```env
NEXT_PUBLIC_API_URL=https://api.example.com
WX_TOKEN=secret_token_here  # NOT exposed
```

---

## Common Tasks

### Adding a New Page

1. **Create page file:**
   ```typescript
   // src/app/features/page.tsx
   export default function FeaturesPage() {
     return <main>Features</main>;
   }
   ```

2. **Auto-routed as:** `https://domain.com/features`

3. **Add layout (if needed):**
   ```typescript
   // src/app/layout.tsx - shared layout
   // src/app/features/layout.tsx - features-specific layout
   ```

### Adding a New API Endpoint

**App Router approach (recommended):**
```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ users: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ id: 1 }, { status: 201 });
}
```

Accessible at: `https://domain.com/api/users`

### Querying Database

**Server Component (App Router):**
```typescript
// src/app/dashboard/page.tsx
import { sql } from "@vercel/postgres";

export default async function Dashboard() {
  const { rows } = await sql`SELECT COUNT(*) as count FROM users;`;

  return <div>Users: {rows[0].count}</div>;
}
```

**Client Component via API:**
```typescript
// src/app/components/UserList.tsx
"use client";

import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users").then(r => r.json()).then(setUsers);
  }, []);

  return <div>{users.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}
```

### Styling Components

Use Tailwind CSS utilities:

```tsx
// src/app/components/Card.tsx
export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}
```

---

## Code Style Guidelines

### TypeScript Strict Mode
- **Required:** All files must pass TypeScript strict checking
- **No `any` type:** Use proper types or generics
- **Export types:** `export type` and `export interface` for sharing types

### Naming Conventions
- **Variables/functions:** camelCase
- **Classes/Components:** PascalCase
- **Constants:** UPPER_SNAKE_CASE (if truly constant)
- **Files:** lowercase with hyphens for components (optional), lowercase for utilities

### Code Organization
- **Imports first:** All imports at top of file
- **Types/interfaces next:** Type definitions after imports
- **Main code:** Function/component implementation
- **Exports last:** Export statement (if not default)

### Comments
- **Avoid obvious comments:** "Get user data" on a `getUser()` function is redundant
- **Explain why, not what:** "Retry on network timeout" is better than "Catch errors"
- **TODOs:** Mark incomplete work with `// TODO: description`

### Error Handling
- **Always handle errors:** No silent failures
- **Meaningful messages:** Errors should indicate what failed and why
- **Log in development:** Use `console.log`/`console.error` during dev
- **Monitor in production:** Send errors to logging service

### Performance Considerations
- **Optimize images:** Use `next/image` component
- **Code splitting:** Use dynamic imports for large components
- **Lazy load:** Use `React.lazy()` with Suspense
- **Memoization:** Use `React.memo()` for expensive renders (sparingly)

---

## Testing & Quality

### Current State
**No test framework configured yet.** When tests are added, follow these guidelines:

### Linting

**Run ESLint:**
```bash
pnpm lint
```

**Configuration:** ESLint extends `next/core-web-vitals`

**Common warnings to fix:**
- Unused variables
- Missing `alt` text on images
- Incorrect hook dependencies
- Missing `key` props in lists

### Build Verification

**Before committing, run:**
```bash
pnpm lint && pnpm build
```

**Ensure:**
- No TypeScript errors
- No ESLint warnings (or justified suppressions)
- Build completes successfully
- No console errors/warnings in dev mode

### Recommended Testing Strategy (Future)

When adding test framework:
1. **Unit tests:** Utility functions, helpers
2. **Integration tests:** API routes, database operations
3. **Component tests:** Critical UI components
4. **E2E tests:** User workflows

**Suggested tools:**
- **Jest** for unit/integration tests
- **React Testing Library** for component tests
- **Playwright** or **Cypress** for E2E tests

---

## Git & Version Control

### Commit Message Format

Follow Conventional Commits:
```
type(scope): description

type: feat, fix, docs, style, refactor, test, chore
scope: optional, area of codebase
description: imperative, lowercase, no period
```

Examples:
```bash
git commit -m "feat(auth): add password reset endpoint"
git commit -m "fix(wxValidate): correct signature validation logic"
git commit -m "docs(readme): update setup instructions"
git commit -m "refactor(seed): simplify database initialization"
```

### Branch Naming

```
feature/user-authentication
fix/signature-validation
docs/api-documentation
```

### Pull Request Process

1. Push feature branch
2. Create PR with clear description
3. Link related issues
4. Ensure CI passes (lint, build)
5. Request code review
6. Merge when approved

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### TypeScript Errors After Changes
```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### WeChat Validation Not Working
1. Verify `WX_TOKEN` environment variable is set
2. Check WeChat Developer Dashboard configuration matches
3. Ensure local URL is accessible (use ngrok for local testing)
4. Check logs: `console.log(signature, WX_TOKEN)`

### Database Connection Errors
1. Verify `POSTGRES_URLCONNSTR` is correct
2. Check database is running
3. Verify network access (if remote database)
4. Check connection limits not exceeded

### Build Failures
1. Clear cache: `rm -rf .next && pnpm build`
2. Check TypeScript errors: `pnpm type-check`
3. Check ESLint errors: `pnpm lint`
4. Verify all dependencies installed: `pnpm install`

---

## Quick Reference

### Essential Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm install      # Install dependencies
```

### Project URLs
- Local development: `http://localhost:3000`
- API base: `http://localhost:3000/api`
- WeChat validation: `http://localhost:3000/api/wxValidate`
- Database seed: `POST http://localhost:3000/api/seed`

### Key Files
- **Root layout:** `/src/app/layout.tsx`
- **Home page:** `/src/app/page.tsx`
- **TypeScript config:** `/tsconfig.json`
- **Tailwind config:** `/tailwind.config.ts`
- **Environment vars:** `.env.local`
- **Git ignore:** `.gitignore`

### Important Packages
- `@vercel/postgres` - Database client
- `bcrypt` - Password hashing
- `sha1` - WeChat signature validation
- `next` - Framework
- `tailwindcss` - Styling

---

## Resources

### Official Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/postgres)

### WeChat Integration
- [WeChat Official Documentation](https://developers.weixin.qq.com/)
- [WeChat API Reference](https://developers.weixin.qq.com/doc/offiaccount/JS-SDK/Signature.html)

### Project Structure & Conventions
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Document History

- **2026-02-03:** Initial CLAUDE.md created with comprehensive project documentation
  - Covered project overview, tech stack, directory structure
  - Documented development workflow and conventions
  - Added database setup, API endpoints, and WeChat integration guides
  - Included troubleshooting and quick reference sections

---

*Last Updated: 2026-02-03*
*Maintained for: Claude AI Assistant*
