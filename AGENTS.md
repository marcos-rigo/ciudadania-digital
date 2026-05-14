# AGENTS.md

## Critical quirks

- **Next.js 16 middleware is `proxy.ts`**, not `middleware.ts`. The exported function is `proxy`, not `handler`.
- **Tailwind v4**: no JS config file is used. Custom properties, theme extensions, and custom classes are all in `app/globals.css` via `@import 'tailwindcss'`. `tailwind.config.js` exists but is not the source of truth.
- **Package manager is `npm`**. Ignore `pnpm-lock.yaml` — it's present but not used.
- **No test suite** — `npm run dev` is the only meaningful verification step.
- **`typescript.ignoreBuildErrors: true`** — TypeScript errors won't break the build.
- **Dark mode único** — El diseño es ahora Tech Noir oscuro. ForcedTheme en `app/layout.tsx` es "dark". Los colores del Design System están optimizados para fondo oscuro.

## Supabase: no SDK

Both `lib/auth-server.ts` and `lib/supabase-client.ts` use the Supabase REST API via `fetch` directly. No SDK is installed. Filters use PostgREST operators via `URLSearchParams` (e.g., `eq.`, `gte.`). All calls use `cache: 'no-store'`. Responses with non-ok status throw on the server.

## Auth cookies (two)

- `gestion_session` — `httpOnly: true`, server-only (read by middleware/proxy.ts)
- `spc_auth` — `httpOnly: false`, readable by client components (for UI display)

## Standalone HTML: `gestion-2026.html`

Separate deployment at `josefarhat.com/gestion-2026.html`. It is **not** part of the Next.js app. Auth is client-side JS with `sessionStorage`. Supabase credentials and Resend API key are hardcoded (intentional for static deploy). Passwords hashed with `crypto.subtle.digest('SHA-256', ...)`.

## Environment variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_KEY      # Anon/public key
RESEND_KEY                    # Resend API key (server-only)
NEXT_PUBLIC_EMAIL_FROM        # gestion@josefarhat.com
NEXT_PUBLIC_EMAIL_ADMIN       # Admin notification email
```

## Seed users (dev only)

Run `GET /api/auth/seed` to create the 3 test users (superadmin, empleado, lector).

## Mock data locations

- `/lib/mock/data.ts` — programas, acciones, videos, materiales, tableros, KPIs, alertas
- `/lib/mock/ciudadania-data.ts` — trayectos, videos educativos, podcasts, evaluaciones, certificados

## Commands

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint
```

## Language

All UI text, variable names, and comments are in **Spanish**.