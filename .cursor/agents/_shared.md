---
name: _shared
model: gpt-5.2-codex
description: Project Context (Authoritative)
readonly: true
---

This file is the single source of truth for stack, constraints, and conventions.
All agents MUST treat this as authoritative. If an agent prompt conflicts with this file, this file wins.

---

## Stack (what this codebase is)

### Runtime & Deployment
- **Shopify Oxygen** (Cloudflare Workers edge runtime)
- **Stateless** execution; **no filesystem**
- **Limited Node APIs** (assume most Node built-ins are unavailable unless proven otherwise)

### Framework
- **Shopify Hydrogen 2025.7.1** on **React Router 7**
- **React 18** with **streaming SSR**
- Built with **Vite**

### Data Layer
- **TypeScript strict**
- **GraphQL Storefront + Customer Account APIs**
- **Automated GraphQL codegen**
- **Loaders/actions are the only data boundaries**
  - Reads in `loader`
  - Writes/mutations in `action`

### UI / Styling
- **CSS-first** system
- Tokens via **CSS variables**
- **BEM** class naming
- Primary stylesheet: `app/styles/app.css`
- **Tailwind v4 is restricted to `HeroSection` only**

---

## Constraints (what cannot be violated)

### Edge-only runtime
- Oxygen runs on Cloudflare Workers:
  - No persistent state between requests
  - No filesystem access
  - Avoid Node-only modules/APIs

### CSP and script policy
- **Nonce-based CSP**
- **Zero inline scripts** (no inline `<script>`, no `onClick="..."`, no string-to-code)
- **Zero inline assets** that violate CSP expectations
- Do not weaken CSP (no “temporary” relaxations)

### Security-first pipeline
- Secrets **never** committed
- CI runs: **Snyk**, **npm audit**, **CodeQL**
- Build fails if **GraphQL codegen/types are stale**

### Strict rendering model (streaming SSR)
- Bot detection is in use
- **Critical data must block render**
- **Deferred data must never throw**
  - Deferred loader paths must be wrapped and return safe fallbacks

---

## Conventions (how code is expected to be written)

### Routing & Data Flow
- React Router 7 **file-based routes**
- All fetching in `loader`
- All mutations in `action`
- Revalidation controlled explicitly via `shouldRevalidate`

### Imports & Structure
- Routes: `app/routes`
- Components: `app/components`
- Shared logic: `app/lib`
- Always use `~/*` path alias

### Styling Rules
- No inline styles
- No hardcoded values (use CSS variables / tokens)
- BEM class names
- Mobile-first breakpoints: **45em** and **48em**
- Interactive states required (hover/focus/active/disabled where applicable)
- Tailwind usage restricted to **HeroSection only**

### State & Behavior
- No global state libraries
- Use:
  - Hydrogen primitives (e.g. `useOptimisticCart`)
  - Route loaders
  - Local context/hooks

### Generated Artifacts
- Never edit:
  - `.generated.d.ts`
  - `.react-router/types`
- After GraphQL changes: run `npm run codegen`

---

## Required Gates (agents must enforce)

### Before proposing changes
- Confirm solution is compatible with Cloudflare Workers runtime
- Confirm no CSP violations are introduced
- Confirm loader/action boundaries are respected
- Confirm styling rules are followed (BEM/CSS vars; no inline; Tailwind only in HeroSection)

### When GraphQL changes exist
- Update operations/types via codegen workflow
- Ensure CI gates will pass (types/codegen not stale)

---

## Output Standard (how agents should respond)

When giving implementation guidance, agents must include:
- File paths to change
- A minimal diff strategy (avoid churn)
- Edge cases and failure modes
- Any required commands (e.g. `npm run codegen`) when applicable

Agents must not:
- Invent project files that do not exist
- Suggest adding new dependencies without explicit justification
- Suggest weakening CSP or bypassing security gates
