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

**Next.js 16 App Router** project (React 19) for the Secretaría de Participación Ciudadana (Tucumán, Argentina). Two distinct systems coexist:

1. **Public platform** — ciudadanía digital, programas, acciones (mock data, no auth)
2. **Internal dashboard** — activity reporting, stats, user management (real Supabase auth)

Plus a **standalone HTML file** (`gestion-2026.html`) deployed separately, sharing the same Supabase project.

Root page (`app/page.tsx`) redirects to `/inicio`.

## Routing & Layouts

Five layout trees:

| Tree | Routes | Layout component |
|---|---|---|
| Public | `/inicio`, `/encuestas`, `/transparencia`, `/contacto` | `components/layouts/public-layout.tsx` |
| Ciudadanía Digital | `/ciudadania-digital`, `/trayectos`, `/trayectos/[slug]`, `/contenidos/videos`, `/contenidos/videos/[id]`, `/contenidos/podcast`, `/evaluaciones`, `/certificados`, `/mi-perfil` | `components/layouts/ciudadania-layout.tsx` |
| Equipo | `/equipo/**` (mock, no auth) — incluye `/equipo/login` (demo simulado, sin auth real), `/equipo/programas`, `/equipo/acciones`, `/equipo/reportes`, `/equipo/tableros`, `/equipo/asistente-ia`, `/equipo/capacitacion`, `/equipo/configuracion` | `components/layouts/admin-layout.tsx` |
| Gestión (CMS mock) | `/gestion`, `/gestion/usuarios`, `/gestion/encuestas`, `/gestion/trayectos`, `/gestion/reportes`, `/gestion/contenidos` (mock, no auth) | `components/layouts/gestion-layout.tsx` |
| Dashboard | `/dashboard/**` | `components/dashboard/DashboardLayout.tsx` |

Root layout: `app/layout.tsx` with `ThemeProvider` (next-themes, dark/light via `class` strategy).

## Auth System

### Routes & flow

Auth pages: `/login`, `/registro`, `/verificar`, `/pendiente`, `/reset`, `/reset/nueva`

Each page uses a component from `components/auth/` that calls the corresponding API route. `AuthLayout` (`components/auth/AuthLayout.tsx`) is a shared wrapper used by all auth pages — maneja el fondo `.bg-auth-premium` y el centrado vertical.

**Login flow:**
1. POST `/api/auth/login` → hash SHA256, query Supabase `usuarios` by email
2. If `email_verificado = false` → generate code, send email, return `{verificar: true}`
3. If `estado = 'pendiente'` → return `{pendiente: true}` → redirect `/pendiente`
4. If `estado = 'rechazado'` → error message
5. If `estado = 'aprobado'` → set `gestion_session` cookie, return `{ok: true, rol, nombre}`
6. Client redirects: `superadmin` → `/dashboard/admin/usuarios`, `empleado` → `/dashboard/admin`, others → `/dashboard/estadisticas`

**Session cookies (two are set on login):**
```js
gestion_session = JSON.stringify({ auth: true, nombre, rol })
// httpOnly: true, sameSite: lax, maxAge: 7 days — leído solo por el servidor/middleware

spc_auth = JSON.stringify({ nombre, rol })
// httpOnly: false, sameSite: lax, maxAge: 7 days — leído por componentes cliente para mostrar/ocultar UI y mostrar nombre/rol en navbar
```

### Middleware (proxy.ts)

`proxy.ts` (raíz del proyecto) es el middleware de Next.js 16 (en esta versión el archivo se llama `proxy.ts` en lugar de `middleware.ts`, y la función exportada se llama `proxy`). Protege `/dashboard/**` y redirige usuarios autenticados fuera de `/login`.

**Solo `/dashboard/**` está protegido por el middleware.** Las rutas `/gestion/**` y `/equipo/**` son accesibles sin autenticación — son UIs de demo con datos mock.

Matcher: `['/((?!_next/).*)]'` — intercepta todas las rutas excepto assets de Next.js. La lógica solo actúa sobre `/dashboard` y `/login`.

Route guards in middleware:
- `/dashboard/admin/usuarios` — only `superadmin`; others redirected to `/dashboard/estadisticas`
- `/dashboard/admin` — blocked for `lector`; redirected to `/dashboard/estadisticas`

`/dashboard/page.tsx` hace un redirect server-side adicional: lee la cookie `gestion_session` y redirige según rol (`superadmin` → `/dashboard/admin/usuarios`, `empleado` → `/dashboard/admin`, otros → `/dashboard/estadisticas`). Si la cookie no existe o no es parseable, redirige a `/login`.

### Roles

| Rol | Destino tras login | Puede ver |
|---|---|---|
| `superadmin` | `/dashboard/admin/usuarios` | Gestión completa de usuarios (PATCH/DELETE) |
| `empleado` | `/dashboard/admin` | Panel de carga (MS Forms) |
| `lector` | `/dashboard/estadisticas` | Solo estadísticas |

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
| GET | `/api/auth/migrate` | Migración one-shot: actualiza emails de superadmin y empleado conservando sus password_hash |
| POST | `/api/admin/usuarios` | Crea usuario (requiere rol admin) |
| GET | `/api/admin/usuarios` | Lista todos los usuarios (requiere rol admin) |
| PATCH | `/api/admin/usuarios/[email]` | Actualiza nombre/rol/estado (requiere `superadmin`) |
| DELETE | `/api/admin/usuarios/[email]` | Elimina usuario (requiere `superadmin`) |

**Registro también notifica al admin:** `POST /api/auth/registro` envía email a `NEXT_PUBLIC_EMAIL_ADMIN` informando que hay un nuevo usuario esperando aprobación.

### Server-side auth helpers (`lib/auth-server.ts`)

- `hashPassword(pwd)` — SHA256 hash
- `generarCodigo()` — código OTP de 6 dígitos
- `expiraEn(minutos)` — ISO timestamp futuro
- `sbGetUsuario(email)` — busca usuario por email en Supabase (usa `URLSearchParams`)
- `sbGetUsuarios()` — lista todos los usuarios
- `sbInsertUsuario(data)` — inserta usuario, **lanza error si Supabase devuelve non-ok**
- `sbUpdateUsuario(email, data)` — actualiza campos por email
- `sbDeleteUsuario(email)` — elimina usuario por email
- `enviarEmail(to, subject, html)` — envía via Resend API (falla silenciosa con `console.warn`)
- `tplVerificacion(nombre, codigo)` / `tplReset(codigo)` — templates HTML de email

### Client-side Supabase (`lib/supabase-client.ts`)

- `sbGetActividades(filtros)` — lee tabla `actividades` (para `PanelEstadisticas` tab 2025)
- `sbGetActividades2026(filtros?)` — lee tabla `actividades_2026` con `select=*&order=fecha.desc` (para tab 2026)

**Supabase directo (sin SDK):** Tanto `lib/auth-server.ts` como `lib/supabase-client.ts` usan la REST API de Supabase directamente con `fetch`, sin el SDK de Supabase. Los filtros se pasan como `URLSearchParams` con operadores PostgREST (`eq.`, `gte.`, `lt.`). Las respuestas non-ok lanzan error en el servidor; el cliente recibe `{ ok: false, error }`. Todas las llamadas usan `cache: 'no-store'`.

## Supabase Schema

### Tabla `usuarios`
```sql
id uuid PK, nombre text, email text UNIQUE,
password_hash text,       -- SHA256 hex
rol text,                 -- 'superadmin' | 'empleado' | 'lector'
estado text,              -- 'pendiente' | 'aprobado' | 'rechazado'
email_verificado boolean,
codigo_verificacion text, codigo_expira timestamptz,
codigo_reset text,        reset_expira timestamptz,
creado_en timestamptz
```
RLS: deshabilitado (`ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY`).

### Tabla `actividades`
Columnas usadas en el código: `fecha`, `programa`, `localidad`, `cantidad_personas`, `usuario_nombre`, `created_at`. Alimentada por Microsoft Forms → Excel (no por el app Next.js directamente).

### Tabla `actividades_2026`
Columnas: `id`, `fecha`, `programa`, `localidad`, `cantidad_personas`, `usuario_nombre`, `estrategia`, `institucion`, `direccion`, `duracion`, `grupo_etario`, `tematica`, `descripcion`, `created_at`. Misma fuente (MS Forms). Lógica de agregación en `lib/estadisticas-utils.ts` (`calcularKPIs`, `agruparPorMes`, `calcularPersonasPorMes`, `agruparPorPrograma`, `agruparPorLocalidad`, `agruparPorTematica`).

## Usuarios seed (dev)

Correr `GET /api/auth/seed` para crear usuarios iniciales de prueba.

## Data Layer (mock)

Todas las páginas públicas y de equipo usan datos estáticos — sin llamadas a base de datos:

- `/lib/mock/data.ts` — programas, acciones, videos, materiales, tableros, KPIs, alertas
- `/lib/mock/ciudadania-data.ts` — trayectos, videos educativos, podcasts, evaluaciones, certificados

Interfaces principales en `/lib/types.ts`: `Programa`, `Accion`, `Video`, `Material`, `Tablero`, `Usuario`, `AnalisisIA`. Interfaces de ciudadanía en `/lib/types-ciudadania.ts`: `Trayecto`, `Modulo`, `Evaluacion`, `Certificado`. Tipos del dashboard Power BI en `/types/powerbi.ts`: `PowerBIEmbedProps`, `RefreshState`, `AnioFilter`.

## Home Page Components (`/inicio`)

Secciones en `components/home/` (todas client-side con framer-motion):
- `HeroSection` — hero principal con CTA y animaciones
- `EcosystemSection` — descripción del ecosistema de participación
- `BenefitsSection` — beneficios de la plataforma
- `ScalabilitySection` — sección de escalabilidad/alcance
- `ChallengeSection` — sección de desafíos (existe pero no se usa en `/inicio` actualmente)

## Dashboard Components

- `DashboardLayout` — nav header con nombre, badge de rol, botón logout. Logo lleva a `/inicio`. Nav order: Inicio → Carga → Estadísticas → Usuarios.
- `PanelAdmin` — embed de MS Forms iframe + instrucciones de carga
- `PanelEstadisticas` — lee el query param `?anio=2025|2026`. Tab 2025: fetch de tabla `actividades`, 4 KPI cards, filtros (search + programa + localidad) + paginación 10/pág, 4 gráficos recharts (evolución mensual, personas por mes, por programa, cobertura territorial). Stats/tabla sobre `filtered`; gráficos sobre `data` completa. Tab 2026: header con badge "En vivo" + botón de refresh manual; 4 KPI cards con animación framer-motion (fadeUp + stagger); 5 gráficos recharts (BarChart evolución mensual, AreaChart personas/mes con gradiente, Donut por programa, BarChart horizontal top municipios, BarChart horizontal temáticas); estado vacío elegante si no hay datos; separador visual; sección estática de tablero Power BI al final (imagen `/tablero-2026.png` + botón "Ver tablero completo" que abre SharePoint). Datos de 2026 desde tabla `actividades_2026` vía `sbGetActividades2026` (fetch en primer render del tab, refresh manual). Lógica de gráficos delegada a `lib/estadisticas-utils.ts`.
- `PowerBIEmbed` — **ya no se usa en el Tab 2026**. El componente sigue en `components/dashboard/PowerBIEmbed.tsx` pero no está importado en ningún lugar. Fue reemplazado por una sección estática con imagen `/public/tablero-2026.png` y link a SharePoint. Tipos residuales en `types/powerbi.ts` (`PowerBIEmbedProps`, `RefreshState`); `AnioFilter` sí se sigue usando en `PanelEstadisticas`.
- `RefreshButton` — botón de refresh manual y toggle de pausa; ya solo es relevante como parte de `PowerBIEmbed` (no activo en la UI actual).
- `CrearUsuarioForm` — formulario para crear usuarios (solo admin, POST `/api/admin/usuarios`)
- `ListaUsuarios` — tabla de usuarios con edición y eliminación inline (solo superadmin, usa PATCH/DELETE `/api/admin/usuarios/[email]`)

## Component Conventions

- UI primitives: `/components/ui/` — la mayoría son componentes shadcn/ui (style: "new-york", Radix UI, Lucide icons); no editar salvo bug. Pero estos son componentes **propios del proyecto** y sí se pueden editar: `kpi-stat-card`, `filters-bar`, `status-badge`, `tag-chips`, `alert-card`, `data-table`, `empty-state`, `page-header`, `spotlight-card`, `theme-toggle`, `breadcrumbs`.
- `cn()` de `@/lib/utils` para clases condicionales (clsx + tailwind-merge).
- Path alias `@/` → raíz del proyecto.
- Forms: `react-hook-form` + `zod` (usado en formularios de auth).
- OTP input: `input-otp` (para el campo de 6 dígitos en `/verificar`).
- Toasts: `sonner` (notificaciones).
- Charts: `recharts` (usado en `PanelEstadisticas`).
- Animaciones de componentes: `framer-motion`.
- Scroll animations: `hooks/use-in-view.tsx` — custom hook con `IntersectionObserver` (`threshold: 0.15`), devuelve `{ ref, inView }` para animaciones on-scroll.
- Responsive: `hooks/use-mobile.ts` (`useIsMobile()`) — breakpoint en 768px via `matchMedia`.
- Fechas: `date-fns` disponible para formateo y manipulación de fechas.

## Theming

**Tailwind v4** — configurado con `@import 'tailwindcss'` en `app/globals.css` (sin archivo JS de config separado; `tailwind.config.js` existe pero está vacío). CSS custom properties en hex (no OKLCH) en `app/globals.css`.

**Dark mode deshabilitado:** `ThemeProvider` tiene `forcedTheme="light"` en `app/layout.tsx`, así que el modo oscuro está forzado a light aunque next-themes esté configurado con `attribute="class"`. El componente `theme-toggle` existe pero no tiene efecto real.

Tailwind config con:
- Sombras glow: `glow-sm`, `glow`, `glow-lg`, `glow-accent`
- Animaciones: `pulse-glow`, `float`, `shimmer`
- Fuentes: Poppins (`--font-poppins`, UI sans-serif), Lora (`--font-lora`, contenido serif)

Clases CSS utilitarias custom definidas en `app/globals.css`:
- `.glass` / `.glass-premium` — glassmorphism con `backdrop-blur` y `backdrop-saturate`
- `.glass-dark` — glassmorphism oscuro (`rgba(13,21,38,.55)`)
- `.bg-noise` — textura grain con SVG turbulence filter
- `.bg-hero-premium` — fondo blanco con dot grid + 3 mesh gradients (para hero y secciones principales)
- `.bg-auth-premium` — fondo azul claro con dot grid + gradients (para páginas de auth)
- `.bg-content-subtle` — fondo gris suave `#f4f6fa` con dot grid (para secciones internas)
- `.text-gradient` — gradiente multi-color en texto
- `.card-glow` — sombra sutil + hover lift (`translateY(-2px)`) para cards
- `.metric-value` — texto con gradiente azul para números de estadísticas
- `.divider-fade` — línea divisoria horizontal con fade
- `.badge-aprobado` / `.badge-pendiente` / `.badge-rechazado` — badges de estado de usuario
- `.badge-rol-superadmin` / `.badge-rol-empleado` / `.badge-rol-lector` — badges de rol
- `.section-divider` — decoración de encabezado de sección

## Build Config

Config file: `next.config.mjs`.

- `typescript.ignoreBuildErrors: true` — los errores de TS no rompen el build.
- `images.unoptimized: true` — sin optimización de imágenes de Next.js.
- Deployment: Vercel (`@vercel/analytics` habilitado).
- ESLint: configurado via Next.js built-in; no `eslint.config.*` separado.

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
