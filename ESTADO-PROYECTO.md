# Estado del Proyecto — SPC (Secretaría de Participación Ciudadana)
*Última actualización: 28 de abril de 2026*

---

## Qué es este proyecto

Sistema web para la Secretaría de Participación Ciudadana de Tucumán, Argentina. Tiene dos propósitos diferenciados:

1. **Plataforma pública de Ciudadanía Digital** — trayectos de aprendizaje, videos, podcasts, evaluaciones y certificados para ciudadanos.
2. **Dashboard interno de Gestión 2026** — carga de actividades, estadísticas y gestión de usuarios para el equipo interno.

Además existe un tercer artefacto: `gestion-2026.html`, una SPA standalone que replica parte del dashboard pero desplegada en `josefarhat.com/gestion-2026.html`.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.0.10 (App Router) |
| Runtime | React 19.2 |
| Lenguaje | TypeScript (strict mode OFF, `ignoreBuildErrors: true`) |
| Estilos | Tailwind CSS 4.1 + CSS custom properties (OKLCH) |
| Componentes UI | shadcn/ui (Radix UI base, Lucide icons) |
| Auth | Cookies httpOnly propias (sin NextAuth) |
| Base de datos | Supabase (PostgreSQL vía REST API directo) |
| Email | Resend API |
| Charts | Recharts |
| Deploy | Vercel (inferido) |
| Package manager | npm (hay `pnpm-lock.yaml` pero se usa npm) |

---

## Estructura de directorios clave

```
/SPC
├── app/
│   ├── api/
│   │   ├── auth/          login, logout, registro, verificar, reenviar, reset, seed
│   │   └── admin/         usuarios (GET lista, POST crea)
│   ├── login/             Página de login
│   ├── registro/          Registro de usuario
│   ├── verificar/         Verificación email con código 6 dígitos
│   ├── pendiente/         Pantalla "esperando aprobación"
│   ├── reset/             Solicitar reset de contraseña
│   ├── reset/nueva/       Ingresar nueva contraseña con código
│   ├── dashboard/
│   │   ├── layout.tsx     Server component, valida cookie, pasa nombre+rol
│   │   ├── page.tsx       Redirige según rol
│   │   ├── admin/         Panel de carga (MS Forms embed)
│   │   ├── admin/usuarios Gestión de usuarios (solo admin)
│   │   └── estadisticas/  Panel de estadísticas (lector/prueba)
│   ├── equipo/            Área interna del equipo (mock data)
│   ├── gestion/           Suite de reportes internos (mock data)
│   ├── ciudadania-digital/ Landing principal de ciudadanía
│   ├── trayectos/         Trayectos de aprendizaje
│   ├── contenidos/        Videos y podcasts
│   ├── programas/         Programas de la Secretaría
│   ├── acciones/          Actividades realizadas
│   ├── certificados/      Certificados
│   ├── evaluaciones/      Evaluaciones
│   ├── encuestas/         Encuestas
│   └── ...otras páginas públicas
├── components/
│   ├── auth/              LoginForm, RegistroForm, VerificarForm, ResetForm, ResetNuevaForm, AuthLayout
│   ├── dashboard/         DashboardLayout, PanelAdmin, PanelEstadisticas, CrearUsuarioForm, ListaUsuarios
│   ├── layouts/           public-layout, admin-layout, ciudadania-layout, gestion-layout
│   ├── home/              Secciones del home (hero, benefits, challenge, ecosystem, scalability)
│   └── ui/                ~70 primitivos shadcn/ui — NO editar salvo bug
├── lib/
│   ├── auth-server.ts     Helpers server-side: hash, OTP, Supabase CRUD, Resend
│   ├── supabase-client.ts Helper client-side: sbGetActividades()
│   ├── types.ts           Tipos dominio Gestion 2026
│   ├── types-ciudadania.ts Tipos dominio Ciudadanía Digital
│   ├── utils.ts           cn() (clsx + tailwind-merge)
│   └── mock/
│       ├── data.ts        Datos mock de programas, acciones, KPIs, etc.
│       └── ciudadania-data.ts Datos mock de trayectos, videos, podcasts
├── proxy.ts               Middleware Next.js 16 (protege /dashboard/**)
├── gestion-2026.html      SPA standalone (NO parte del app Next.js)
├── CLAUDE.md              Instrucciones para Claude Code
├── ESTADO-PROYECTO.md     Este archivo
└── .env.local             Variables de entorno
```

---

## Sistema de autenticación (estado actual — funcional)

### Flujo completo

```
/login
  → POST /api/auth/login
    → hashPassword(pwd) → sbGetUsuario(email)
    → si no verificado → genera OTP → envía email → redirige /verificar
    → si pendiente     → redirige /pendiente
    → si rechazado     → error
    → si aprobado      → setea cookie → redirige según rol

/registro
  → POST /api/auth/registro
    → valida campos → sbGetUsuario(email) (chequea duplicado)
    → sbInsertUsuario({ estado: 'pendiente', email_verificado: false, ... })
    → envía email verificación al usuario + notificación al admin
    → redirige /verificar

/verificar
  → POST /api/auth/verificar
    → sbGetUsuario(email) → valida código y expiración
    → sbUpdateUsuario → { email_verificado: true }
    → redirige /pendiente (esperando aprobación manual en Supabase)

/reset
  → POST /api/auth/reset (paso 1: email)
    → genera código → sbUpdateUsuario → envía email
  → POST /api/auth/reset (paso 2: código + nueva contraseña)
    → valida código y expiración → hashPassword → sbUpdateUsuario
```

### Cookie de sesión

```js
gestion_session = JSON.stringify({ auth: true, nombre: "...", rol: "admin|lector|prueba" })
// httpOnly: true, sameSite: 'lax', maxAge: 7 días, secure: true en producción
```

### Protección de rutas (proxy.ts)

- `/dashboard/**` sin cookie → redirect `/login`
- `/login` con cookie válida → redirect según rol
- Validación doble: proxy.ts (edge) + `app/dashboard/layout.tsx` (server component)

### Roles del sistema

| Rol | Acceso |
|---|---|
| `admin` | `/dashboard/admin` (carga MS Forms) + `/dashboard/admin/usuarios` |
| `lector` | `/dashboard/estadisticas` (solo lectura) |
| `prueba` | `/dashboard/estadisticas` con banner amarillo de advertencia |

### Aprobación de usuarios

El flujo de registro deja al usuario en `estado = 'pendiente'`. **La aprobación es manual**: hay que ir a Supabase y cambiar `estado` a `'aprobado'`. No hay panel de aprobación en el app todavía (pendiente de implementar).

---

## Supabase

### Proyecto
URL: `https://tllxplxsjrwyaqepuvzo.supabase.co`

### Tabla `usuarios`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
nombre          text NOT NULL
email           text UNIQUE NOT NULL
password_hash   text NOT NULL          -- SHA256 hex
rol             text DEFAULT 'lector'  -- 'admin' | 'lector' | 'prueba'
estado          text DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente', 'aprobado', 'rechazado'))
email_verificado boolean DEFAULT false
codigo_verificacion text
codigo_expira   timestamptz
codigo_reset    text
reset_expira    timestamptz
creado_en       timestamptz DEFAULT NOW()
```

**RLS deshabilitado** (`ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY`).

### Tabla `actividades`

Columnas usadas por el código: `fecha`, `programa`, `localidad`, `cantidad_personas`, `usuario_nombre`, `created_at`. Esta tabla **no se llena desde el app Next.js** — se llena vía Microsoft Forms → Excel. El app solo la lee para mostrar estadísticas.

### Usuarios seed (credenciales de prueba)

Creados corriendo `GET /api/auth/seed` en desarrollo:

| Nombre | Email | Password | Rol |
|---|---|---|---|
| Administrador | `admin@participacionciudadana.gob.ar` | `Admin2026!` | admin |
| Lector | `lector@participacionciudadana.gob.ar` | `Lector2026!` | lector |
| Profesor Duilio | `dsardi@prueba.com` | `Prueba2026!` | prueba |

---

## Variables de entorno (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tllxplxsjrwyaqepuvzo.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=eyJ...          # Anon key pública
RESEND_KEY=re_...                        # Server-only (sin prefijo NEXT_PUBLIC_)
NEXT_PUBLIC_EMAIL_FROM=gestion@josefarhat.com
NEXT_PUBLIC_EMAIL_ADMIN=jf.josefarhat@gmail.com
```

---

## Capa de datos

### Datos reales (Supabase)
- `usuarios` — autenticación y gestión de usuarios
- `actividades` — estadísticas del dashboard (solo lectura desde el app)

### Datos mock (archivos locales)
**Todo lo demás usa datos estáticos** — sin llamadas a base de datos:

`/lib/mock/data.ts` contiene:
- `programas[]` — 5 programas de la Secretaría
- `acciones[]` — 10 actividades de ejemplo
- `videos[]` — 5 videos de capacitación
- `materiales[]` — materiales descargables (PDF, PPT)
- `tableros[]` — enlaces a Power BI / Looker / Metabase
- `documentos[]` — documentos de transparencia
- `kpisInternos[]` — KPIs internos
- `alertas[]` — alertas del sistema
- `tematicas[]`, `publicos[]`, `territorios[]` — listas de referencia

`/lib/mock/ciudadania-data.ts` contiene:
- `mockTrayectos[]` — trayectos de aprendizaje con módulos
- `mockVideosEducativos[]`, `mockPodcasts[]`
- `mockEvaluaciones[]`, `mockEncuestas[]`, `mockCertificados[]`
- `mockEstadisticas` — KPIs de ciudadanía digital
- `mockUsers[]` — usuarios de ejemplo

---

## Componentes principales del dashboard

### `DashboardLayout` (`components/dashboard/DashboardLayout.tsx`)
- Header con gradiente azul marino
- Nav condicional por rol (admin ve "Carga" y "Usuarios", lector/prueba ve "Estadísticas")
- Badge de rol con colores: admin=azul, lector=gris, prueba=amarillo
- Botón logout → POST `/api/auth/logout` → redirect `/login`

### `PanelAdmin` (`components/dashboard/PanelAdmin.tsx`)
- Instrucciones de carga en 4 pasos
- Botón para abrir formulario MS Forms en pantalla completa
- Embed de MS Forms en iframe (altura 720px)
- URL del form hardcodeada en la constante `FORMS_URL`

### `PanelEstadisticas` (`components/dashboard/PanelEstadisticas.tsx`)
- Carga datos reales de Supabase (`actividades` table) via `sbGetActividades()`
- 3 StatCards: total actividades, total personas, promedio por actividad
- Tabla de últimas 10 actividades

### `CrearUsuarioForm` + `ListaUsuarios`
- Accesibles en `/dashboard/admin/usuarios`
- Formulario llama POST `/api/admin/usuarios` (requiere rol admin en cookie)
- Lista llama GET `/api/admin/usuarios` (requiere rol admin)

---

## Archivo standalone: gestion-2026.html

**No es parte del app Next.js.** Se despliega como HTML estático en `josefarhat.com/gestion-2026.html`.

- Mismo sistema de auth que el app Next.js pero implementado en vanilla JS
- Misma tabla `usuarios` del mismo Supabase project
- Sesión en `sessionStorage` (no cookies)
- Passwords con `crypto.subtle` SHA256 (mismo algoritmo)
- Credenciales Supabase y Resend hardcodeadas en líneas ~335–337 (intencional)
- Contenido: embed de MS Forms para carga de actividades + vista de estadísticas

---

## Theming y estilos

- **Colores**: CSS custom properties con escala OKLCH (light + dark mode via `class`)
- **Fuentes**: Poppins (UI general), Lora (títulos y contenido editorial)
- **Sombras glow**: `glow-sm`, `glow`, `glow-lg`, `glow-accent` (Tailwind utilities)
- **Animaciones**: `pulse-glow`, `float`, `shimmer`
- **Color primario del dashboard**: `#4272bb` (azul institucional), fondo header `#1A2A36` → `#4272bb`

---

## Estado actual de funcionalidades

### ✅ Funcionando

- Sistema de login/logout con cookie httpOnly
- Verificación de email con OTP 6 dígitos (Resend)
- Reset de contraseña por email (2 pasos)
- Registro con estado pendiente + notificación al admin
- Redirección por rol tras login
- Panel admin: embed MS Forms
- Panel estadísticas: lectura de tabla `actividades`
- Gestión de usuarios: crear y listar (admin only)
- Seed de usuarios de prueba (`/api/auth/seed`)
- Protección de rutas (proxy.ts + layout server component)

### ⏳ Pendiente / No implementado

- **Aprobación de usuarios desde el app** — hoy se hace manualmente en Supabase
- **Tabla `actividades` en Supabase** — puede que no exista aún (el app la lee pero no la crea)
- Todas las páginas de `/equipo/**` y `/gestion/**` usan datos mock sin funcionalidad real
- Ciudadanía digital: trayectos, evaluaciones, certificados son 100% mock
- No hay panel de métricas real para el admin más allá del iframe de MS Forms

### ⚠️ Limitaciones conocidas

- `typescript.ignoreBuildErrors: true` — errores de TS no rompen el build
- No hay rate limiting en los endpoints de auth
- Las credenciales de Supabase (`NEXT_PUBLIC_SUPABASE_KEY`) son públicas por diseño (anon key)
- `RESEND_KEY` está en variable `NEXT_PUBLIC_` en `.env.local` pero debería ser solo server-side — está correctamente referenciada como `process.env.RESEND_KEY` en el código (no expuesta al cliente)
- No hay CSRF protection explícita

---

## Bugs corregidos recientemente (sesión 28/04/2026)

1. **`sbGetUsuario`** — estaba siendo llamada con solo el email como string crudo, generando URLs inválidas como `?admin@test.com`. Corregida para usar `URLSearchParams` con el filtro `email=eq.{email}`.
2. **`sbInsertUsuario`** — no verificaba `r.ok`, las fallas de Supabase eran silenciosas. Ahora lanza `Error` con el mensaje de Supabase.
3. **`/api/admin/usuarios` GET** — handler roto (código cortado a mitad, variable `usuarios` undefined). Corregido con `const usuarios = await sbGetUsuarios()`.
4. **`middleware.ts` → `proxy.ts`** — renombrado para cumplir con la convención de Next.js 16.
5. **Selector de rol en LoginForm** — eliminado. Era confuso (el API ignora el rol enviado por el cliente y usa el de la BD).
6. **Tabla `usuarios`** — faltaba columna `rol` y el CHECK constraint tenía `'activo'` en lugar de `'aprobado'`. Requirió SQL manual en Supabase.

---

## Flujo para agregar una nueva página autenticada

1. Crear `app/nueva-ruta/page.tsx` con `export default async function`
2. Leer la cookie con `cookies()` de `next/headers` para obtener nombre y rol
3. Si necesita protección, agregar la ruta al matcher de `proxy.ts`
4. El layout del dashboard ya cubre `/dashboard/**` automáticamente

## Flujo para agregar un nuevo endpoint de API

1. Crear `app/api/nombre/route.ts`
2. Para endpoints admin: verificar cookie con `cookies()`, parsear JSON, chequear `data.rol === 'admin'`
3. Para llamadas a Supabase: usar las funciones de `lib/auth-server.ts` (server) o `lib/supabase-client.ts` (client)

---

## Contacto y contexto del proyecto

- **Organismo**: Secretaría de Participación Ciudadana, Tucumán, Argentina
- **Nombre del portal de gestión**: "Informe de Gestión 2026 · José Farhat"
- **Dominio del HTML standalone**: `josefarhat.com/gestion-2026.html`
- **Email del formulario**: `gestion@josefarhat.com`
- **Supabase project ID**: `tllxplxsjrwyaqepuvzo`
