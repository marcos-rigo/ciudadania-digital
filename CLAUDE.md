# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

No test suite is configured. Package manager: `npm` (ignore the `pnpm-lock.yaml`).

## Architecture Overview

**Next.js 16 App Router** project for the Secretaría de Participación Ciudadana (Tucumán, Argentina). Two distinct systems coexist:

1. **Public platform** — ciudadanía digital, programas, acciones (mock data, no auth)
2. **Internal dashboard** — activity reporting, stats, user management (real Supabase auth)

Plus a **standalone HTML file** (`gestion-2026.html`) deployed separately, sharing the same Supabase project.

## Routing & Layouts

Four layout trees:

| Tree | Routes | Layout component |
|---|---|---|
| Public | `/`, `/programas`, `/acciones`, `/ciudadania-digital`, etc. | `components/layouts/public-layout.tsx` |
| Equipo/Admin | `/equipo/**`, `/gestion/**` | `components/layouts/admin-layout.tsx` |
| Ciudadanía Digital | `/ciudadania-digital`, `/trayectos`, `/contenidos` | `components/layouts/ciudadania-layout.tsx` |
| Dashboard | `/dashboard/**` | `components/dashboard/DashboardLayout.tsx` |

Root layout: `app/layout.tsx` with `ThemeProvider` (next-themes, dark/light via `class` strategy).

## Auth System

### Routes & flow

Auth pages: `/login`, `/registro`, `/verificar`, `/pendiente`, `/reset`, `/reset/nueva`

Each page uses a component from `components/auth/` that calls the corresponding API route.

**Login flow:**
1. POST `/api/auth/login` → hash SHA256, query Supabase `usuarios` by email
2. If `email_verificado = false` → generate code, send email, return `{verificar: true}`
3. If `estado = 'pendiente'` → return `{pendiente: true}` → redirect `/pendiente`
4. If `estado = 'rechazado'` → error message
5. If `estado = 'aprobado'` → set `gestion_session` cookie, return `{ok: true, rol, nombre}`
6. Client redirects: `admin` → `/dashboard/admin`, others → `/dashboard/estadisticas`

**Session cookie:**
```js
gestion_session = JSON.stringify({ auth: true, nombre, rol })
// httpOnly, sameSite: lax, maxAge: 7 days, secure in production
```

### Middleware (proxy.ts)

`proxy.ts` (renamed from `middleware.ts` for Next.js 16) protects `/dashboard/**` and redirects authenticated users away from `/login`.

Matcher: `['/login', '/dashboard/:path*']`

### Roles

| Rol | Destino tras login | Puede ver |
|---|---|---|
| `admin` | `/dashboard/admin` | Panel de carga (MS Forms) + gestión de usuarios |
| `lector` | `/dashboard/estadisticas` | Solo estadísticas |
| `prueba` | `/dashboard/estadisticas` | Estadísticas + banner de cuenta de prueba |

### API routes

| Method | Route | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login, setea cookie |
| POST | `/api/auth/logout` | Borra cookie |
| POST | `/api/auth/registro` | Registra usuario (estado: pendiente) |
| POST | `/api/auth/verificar` | Verifica código de 6 dígitos |
| POST | `/api/auth/reenviar` | Reenvía código de verificación |
| POST | `/api/auth/reset` | Solicita/completa reset de contraseña |
| GET | `/api/auth/seed` | Crea los 3 usuarios iniciales (solo dev) |
| POST | `/api/admin/usuarios` | Crea usuario (requiere rol admin) |
| GET | `/api/admin/usuarios` | Lista todos los usuarios (requiere rol admin) |

### Server-side auth helpers (`lib/auth-server.ts`)

- `hashPassword(pwd)` — SHA256 hash
- `generarCodigo()` — código OTP de 6 dígitos
- `expiraEn(minutos)` — ISO timestamp futuro
- `sbGetUsuario(email)` — busca usuario por email en Supabase (usa `URLSearchParams`)
- `sbGetUsuarios()` — lista todos los usuarios
- `sbInsertUsuario(data)` — inserta usuario, **lanza error si Supabase devuelve non-ok**
- `sbUpdateUsuario(email, data)` — actualiza campos por email
- `enviarEmail(to, subject, html)` — envía via Resend API (falla silenciosa con `console.warn`)
- `tplVerificacion(nombre, codigo)` / `tplReset(codigo)` — templates HTML de email

### Client-side Supabase (`lib/supabase-client.ts`)

- `sbGetActividades(filtros)` — lee tabla `actividades` (para `PanelEstadisticas`)

## Supabase Schema

### Tabla `usuarios`
```sql
id uuid PK, nombre text, email text UNIQUE,
password_hash text,       -- SHA256 hex
rol text,                 -- 'admin' | 'lector' | 'prueba'
estado text,              -- 'pendiente' | 'aprobado' | 'rechazado'
email_verificado boolean,
codigo_verificacion text, codigo_expira timestamptz,
codigo_reset text,        reset_expira timestamptz,
creado_en timestamptz
```
RLS: deshabilitado (`ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY`).

### Tabla `actividades`
Columnas usadas en el código: `fecha`, `programa`, `localidad`, `cantidad_personas`, `usuario_nombre`, `created_at`. Alimentada por Microsoft Forms → Excel (no por el app Next.js directamente).

## Usuarios seed (dev)

Correr `GET /api/auth/seed` para crear:

| Email | Password | Rol |
|---|---|---|
| `admin@participacionciudadana.gob.ar` | `Admin2026!` | admin |
| `lector@participacionciudadana.gob.ar` | `Lector2026!` | lector |
| `dsardi@prueba.com` | `Prueba2026!` | prueba |

## Data Layer (mock)

Todas las páginas públicas y de equipo usan datos estáticos — sin llamadas a base de datos:

- `/lib/mock/data.ts` — programas, acciones, videos, materiales, tableros, KPIs, alertas
- `/lib/mock/ciudadania-data.ts` — trayectos, videos educativos, podcasts, evaluaciones, certificados

Interfaces principales en `/lib/types.ts`: `Programa`, `Accion`, `Video`, `Material`, `Tablero`, `Usuario`, `AnalisisIA`. Interfaces de ciudadanía en `/lib/types-ciudadania.ts`: `Trayecto`, `Modulo`, `Evaluacion`, `Certificado`.

## Dashboard Components

- `DashboardLayout` — nav header con nombre, badge de rol, botón logout
- `PanelAdmin` — embed de MS Forms iframe + instrucciones de carga
- `PanelEstadisticas` — cards de estadísticas + tabla de últimas 10 actividades (fetch real a Supabase)
- `CrearUsuarioForm` — formulario para crear usuarios (solo admin, POST `/api/admin/usuarios`)
- `ListaUsuarios` — tabla de usuarios (solo admin, GET `/api/admin/usuarios`)

## Component Conventions

- UI primitives: `/components/ui/` — shadcn/ui (style: "new-york", Radix UI, Lucide icons). No editar salvo bug.
- `cn()` de `@/lib/utils` para clases condicionales (clsx + tailwind-merge).
- Path alias `@/` → raíz del proyecto.

## Theming

CSS custom properties (OKLCH) en `app/globals.css`. Tailwind config con:
- Sombras glow: `glow-sm`, `glow`, `glow-lg`, `glow-accent`
- Animaciones: `pulse-glow`, `float`, `shimmer`
- Fuentes: Poppins (UI), Lora (contenido serif)

## Build Config

- `typescript.ignoreBuildErrors: true` — los errores de TS no rompen el build.
- `images.unoptimized: true` — sin optimización de imágenes de Next.js.

## Standalone HTML: `gestion-2026.html`

**No es parte del app Next.js.** Se despliega separado en `josefarhat.com/gestion-2026.html`.

- Stack: HTML + CSS/JS inline. CDN: Bootstrap, Font Awesome 6, Animate.css.
- Auth: mismo flujo que el app Next.js pero todo client-side JS, sesión en `sessionStorage`.
- Mismo Supabase project y tabla `usuarios`. Passwords hasheadas con `crypto.subtle` (SHA256).
- Credenciales Supabase y Resend hardcodeadas en líneas ~335–337 (intencional para deploy estático).
- Contenido principal: embed de MS Forms para carga de actividades.

## Env Vars (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL     # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_KEY     # Anon/public key
RESEND_KEY                   # API key de Resend (server-only)
NEXT_PUBLIC_EMAIL_FROM       # gestion@josefarhat.com
NEXT_PUBLIC_EMAIL_ADMIN      # Email del admin para notificaciones
```

## Language

Todo el texto de UI, nombres de variables de dominio y contenido están en **español**. Mantener consistencia en código nuevo y comentarios.
