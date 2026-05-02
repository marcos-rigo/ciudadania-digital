# Documentación Completa del Proyecto — SPC
## Secretaría de Estado de Participación Ciudadana · Tucumán, Argentina

---

## 1. Descripción General

**Nombre del proyecto:** Sistema de Gestión e Información — Secretaría de Participación Ciudadana  
**Organismo:** Secretaría de Estado de Participación Ciudadana, Ministerio de Seguridad, Provincia de Tucumán, Argentina  
**Referente institucional:** Dr. José Farhat (Secretario)  
**Framework:** Next.js 16 (App Router) · React 19 · TypeScript  
**Base de datos:** Supabase (PostgreSQL)  
**Deploy:** Vercel  

El proyecto es una plataforma web integral con dos sistemas bien diferenciados que comparten el mismo codebase:

1. **Plataforma pública** — portal ciudadano con información institucional, programas, acciones, ciudadanía digital y resultados. Usa datos mock, sin autenticación.
2. **Dashboard interno** — herramienta privada para el equipo de la Secretaría: registro de actividades, estadísticas reales desde Supabase, y gestión de usuarios. Requiere login.

Además existe un **archivo HTML standalone** (`gestion-2026.html`) desplegado de forma separada en `josefarhat.com/gestion-2026.html`, que comparte el mismo proyecto Supabase y tabla de usuarios pero funciona con JS puro, Bootstrap y autenticación client-side.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS v4 (CSS-first config) |
| Componentes UI | shadcn/ui (estilo "new-york") + Radix UI |
| Iconos | Lucide React |
| Fuentes | Poppins (UI/sans), Lora (display/serif) |
| Base de datos | Supabase (PostgreSQL) |
| Auth custom | Cookies httpOnly + SHA256 hash (sin Supabase Auth) |
| Email | Resend API |
| Formularios | MS Forms (embed iframe) |
| Gráficos | Recharts |
| Analytics | @vercel/analytics |
| Animaciones | tailwindcss-animate + CSS keyframes propios |

**Package manager:** `npm` (ignorar `pnpm-lock.yaml`).  
**Build:** `typescript.ignoreBuildErrors: true`, `images.unoptimized: true`.  
**Path alias:** `@/` → raíz del proyecto.

---

## 3. Arquitectura de Rutas y Layouts

La aplicación tiene **cinco árboles de layout** independientes:

### 3.1 Árbol Público (`/inicio`, `/programas`, `/acciones`, `/resultados`, `/transparencia`, `/contacto`)
- Layout: `components/layouts/public-layout.tsx`
- Sin auth. Datos mock.
- `app/page.tsx` redirige a `/inicio` (la home real).

### 3.2 Árbol Equipo (`/equipo/**`)
- Layout: `components/layouts/admin-layout.tsx`
- Sin auth. Interfaz demo con datos mock.
- Incluye: Dashboard, Programas, Acciones, Tableros, Capacitación, Asistente IA, Reportes, Configuración.

### 3.3 Árbol Gestión CMS (`/gestion/**`)
- Layout: `components/layouts/gestion-layout.tsx`
- Sin auth. CMS demo para Ciudadanía Digital con datos mock.
- Incluye: Dashboard, Usuarios, Trayectos, Contenidos, Encuestas, Reportes.
- Usa Recharts para gráficos de línea y torta.

### 3.4 Árbol Ciudadanía Digital (`/ciudadania-digital`, `/trayectos`, `/contenidos/**`, `/evaluaciones`, `/certificados`, `/mi-perfil`)
- Layout: `components/layouts/ciudadania-layout.tsx`
- Sin auth. Plataforma formativa pública, datos mock.

### 3.5 Árbol Dashboard Interno (`/dashboard/**`) — ÚNICO CON AUTH REAL
- Layout: `app/dashboard/layout.tsx` + `components/dashboard/DashboardLayout.tsx`
- Protegido por middleware (`proxy.ts`) y server-side cookie check.
- Datos reales desde Supabase.

### 3.6 Auth standalone (`/login`, `/registro`, `/verificar`, `/pendiente`, `/reset`, `/reset/nueva`)
- Sin layout compartido, usa `components/auth/AuthLayout.tsx` y componentes individuales de `components/auth/`.

---

## 4. Sistema de Autenticación

### Middleware (`proxy.ts`)
El middleware de Next.js 16 se llama `proxy.ts` (no `middleware.ts`) y la función exportada se llama `proxy`. Matcher: `['/login', '/dashboard/:path*']`.

**Solo protege `/dashboard/**`** — todo lo demás es público o demo.

Lógica del middleware:
- Sin cookie → redirige a `/login`
- Cookie con rol inválido → borra cookie y redirige a `/login`
- `/dashboard/admin/usuarios` con rol != `superadmin` → redirige a `/dashboard/estadisticas`
- `/dashboard/admin` con rol `lector` → redirige a `/dashboard/estadisticas`
- Usuario en `/login` con sesión válida → redirige según rol

### Cookie de sesión
```js
gestion_session = JSON.stringify({ auth: true, nombre, rol })
// httpOnly: true, sameSite: 'lax', maxAge: 604800 (7 días), secure: en producción
```

### Flujo de login
1. `POST /api/auth/login` → SHA256 del password, busca en Supabase `usuarios` por email
2. Si `email_verificado = false` → genera código OTP, envía email via Resend, responde `{ verificar: true }`
3. Si `estado = 'pendiente'` → responde `{ pendiente: true }` → cliente redirige a `/pendiente`
4. Si `estado = 'rechazado'` → error descriptivo
5. Si `estado = 'aprobado'` → setea cookie, responde `{ ok: true, rol, nombre }`
6. Cliente redirige: `superadmin` → `/dashboard/admin/usuarios`, `empleado` → `/dashboard/admin`, `lector` → `/dashboard/estadisticas`

### Roles

| Rol | Destino post-login | Permisos |
|---|---|---|
| `superadmin` | `/dashboard/admin/usuarios` | Gestión completa de usuarios (crear/editar/eliminar) |
| `empleado` | `/dashboard/admin` | Panel de carga MS Forms |
| `lector` | `/dashboard/estadisticas` | Solo ver estadísticas |

### API Routes de auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login + set cookie |
| POST | `/api/auth/logout` | Borra cookie |
| POST | `/api/auth/registro` | Nuevo usuario (estado: pendiente) |
| POST | `/api/auth/verificar` | Verifica código OTP de 6 dígitos |
| POST | `/api/auth/reenviar` | Reenvía código OTP |
| POST | `/api/auth/reset` | Solicita/completa reset de contraseña |
| GET | `/api/auth/seed` | Crea 3 usuarios iniciales (solo dev) |
| POST | `/api/admin/usuarios` | Crea usuario (requiere admin) |
| GET | `/api/admin/usuarios` | Lista usuarios (requiere admin) |
| PATCH | `/api/admin/usuarios/[email]` | Edita usuario (requiere superadmin) |
| DELETE | `/api/admin/usuarios/[email]` | Elimina usuario (requiere superadmin) |

### Helpers server-side (`lib/auth-server.ts`)
Todas las llamadas a Supabase se hacen mediante fetch directo a la REST API (no al SDK de Supabase) usando la `anon key` en los headers. El módulo incluye:
- `hashPassword(pwd)` — SHA256 hex
- `generarCodigo()` — OTP de 6 dígitos
- `expiraEn(minutos)` — ISO timestamp futuro
- `sbGetUsuario(email)`, `sbGetUsuarios()`, `sbInsertUsuario(data)`, `sbUpdateUsuario(email, data)`, `sbDeleteUsuario(email)` — CRUD via fetch a Supabase REST
- `enviarEmail(to, subject, html)` — falla silenciosa (solo `console.warn`)
- `tplVerificacion(nombre, codigo)` / `tplReset(codigo)` — templates HTML de email inline

---

## 5. Base de Datos (Supabase)

### Tabla `usuarios`
```sql
id              uuid PK DEFAULT gen_random_uuid()
nombre          text
email           text UNIQUE NOT NULL
password_hash   text           -- SHA256 hex
rol             text           -- 'superadmin' | 'empleado' | 'lector'
estado          text           -- 'pendiente' | 'aprobado' | 'rechazado'
email_verificado boolean
codigo_verificacion  text
codigo_expira        timestamptz
codigo_reset         text
reset_expira         timestamptz
creado_en            timestamptz DEFAULT now()
```
RLS deshabilitado. No usa Supabase Auth.

### Tabla `actividades`
```sql
id               uuid PK DEFAULT gen_random_uuid()
fecha            date NOT NULL
programa         text
localidad        text
cantidad_personas integer DEFAULT 0
usuario_nombre   text
created_at       timestamptz DEFAULT now()
```
Alimentada externamente vía Microsoft Forms → Excel (no desde Next.js). El archivo `seed-2025.sql` contiene 106 registros reales del año 2025, totalizando **9.033 personas** en actividades que van desde reuniones de planificación hasta grandes eventos (hasta 1.250 personas). Los programas registrados son: Reunión de planificación, Familias en la web, Docentes Conectados, Escuela de Ciudadanía, Juntos es más Seguro, Vínculos Preventivos, GloPaC.

### Inicialización dev
```bash
# Correr seed de usuarios:
GET http://localhost:3000/api/auth/seed

# Importar actividades 2025:
# Pegar seed-2025.sql en Supabase → SQL Editor
```

### Client-side (`lib/supabase-client.ts`)
- `sbGetActividades(query)` — fetch a Supabase REST API con filtros, usado en `PanelEstadisticas`

---

## 6. Variables de Entorno (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL      # https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_KEY      # anon/public key
RESEND_KEY                    # API key de Resend (server-only)
NEXT_PUBLIC_EMAIL_FROM        # gestion@josefarhat.com
NEXT_PUBLIC_EMAIL_ADMIN       # email del admin para notificaciones
```

---

## 7. Sistema de Diseño y Estilos

### 7.1 Tailwind v4
Configurado con `@import 'tailwindcss'` directo en `app/globals.css`. Existe `tailwind.config.js` con la extensión del tema (colores, fuentes, sombras). El dark mode usa la estrategia `class` (toggled por `next-themes` con `ThemeProvider`).

### 7.2 Paleta de colores

**Light mode:**
| Token | Valor | Uso |
|---|---|---|
| `--background` | `linear-gradient(135deg, #f8f9fb → #f0f4f9)` | Fondo general |
| `--foreground` | `#0f172a` | Texto principal |
| `--card` | `#ffffff` | Superficies |
| `--primary` | `#0066ff` | Azul vibrante |
| `--secondary` | `#7c3aed` | Violeta tech |
| `--accent` | `#00d9ff` | Cian eléctrico |
| `--muted` | `#e2e8f0` | Texto secundario |
| `--sidebar` | `#1a1f3a` | Fondo sidebar oscuro |
| `--destructive` | `#ef4444` | Rojo errores |

**Dark mode:**
| Token | Valor |
|---|---|
| `--background` | `linear-gradient(135deg, #0f172a → #1a1f3a)` |
| `--card` | `#1a1f3a` |
| `--primary` | `#3b82f6` |
| `--secondary` | `#8b5cf6` |
| `--accent` | `#06b6d4` |
| `--muted` | `#334155` |

**Colores para charts:** `--chart-1` a `--chart-5`: azul, violeta, cian, amber, pink.

### 7.3 Tipografía
- **Sans (UI):** Poppins (400, 500, 600, 700, 800) — todos los elementos de interfaz
- **Serif/Display:** Lora (400, 500, 600, 700) — contenidos educativos y encabezados de secciones
- Cargadas via `next/font/google` en `app/layout.tsx`

### 7.4 Border radius
Base: `--radius: 0.75rem (12px)`. Escala: `sm` (8px), `md` (10px), `lg` (12px), `xl` (16px).

### 7.5 Sombras
```
shadow-glow-sm:    0 0 10px rgba(59,130,246, 0.3)
shadow-glow:       0 0 20px rgba(59,130,246, 0.3)
shadow-glow-lg:    0 0 30px rgba(59,130,246, 0.4)
shadow-glow-accent: 0 0 20px rgba(0,217,255, 0.3)
shadow-card-hover: 0 20px 40px rgba(0,0,0, 0.1)
```

### 7.6 Clases utilitarias personalizadas (en `app/globals.css`)

| Clase | Efecto |
|---|---|
| `.glass` | Glassmorphism: `bg-white/10 backdrop-blur-lg border border-white/20` |
| `.gradient-text` | Texto con gradiente azul → violeta → pink, `bg-clip-text text-transparent` |
| `.card-modern` | Card con `rounded-2xl`, hover eleva sombra, overlay gradient sutil en hover |
| `.btn-tech` | Botón que se eleva `translateY(-2px)` en hover |
| `.glow` | Sombra glow azul, más intensa en hover |
| `.glow-accent` | Sombra glow cian, más intensa en hover |
| `.gradient-border` | Borde con gradiente `#0066ff → #00d9ff → #7c3aed` via background-clip |
| `.input-modern` | Input con fondo semitransparente, glow azul en focus |
| `.hover-lift` | `translateY(-6px)` + shadow-lg en hover |
| `.parallax-translate` | Transición suave para microparalaje JS-driven |
| `.reveal` | Estado inicial de animaciones de entrada (opacidad 0, ligero desplazamiento) |
| `.shimmer` | Loading skeleton con gradiente animado |

### 7.7 Animaciones (keyframes)

| Nombre | Duración | Descripción |
|---|---|---|
| `fade-up` | 560ms `cubic-bezier(.16,.84,.3,1)` | Entrada desde abajo con escala sutil |
| `fade-in` | 420ms ease | Fade simple |
| `pulse-glow` | 2s infinite | Box-shadow pulsante azul |
| `float` | 3s ease-in-out infinite | Flotación vertical ±10px |
| `shimmer` | 2s infinite | Gradiente deslizante horizontal |

Todas desactivadas con `prefers-reduced-motion: reduce`.

---

## 8. Layouts en Detalle

### 8.1 Public Layout (`components/layouts/public-layout.tsx`)

**Header sticky con glassmorphism:**
- Logo institucional (izquierda)
- Nav centrada: `Inicio`, `Programas`, `Acciones`, `Resultados`
- Acciones (derecha): `ThemeToggle` + botón `Ingresar` → `/login`
- Menú hamburguesa en mobile (Sheet component de shadcn)
- Link activo con efecto glow

**Footer en 4 columnas (responsive):**
- Columna 1: Logo + descripción breve + copyright
- Columna 2: Navegación rápida (Inicio, Programas, Acciones, Resultados)
- Columna 3: Transparencia, Contacto
- Columna 4: Datos institucionales

### 8.2 Admin Layout — Equipo (`components/layouts/admin-layout.tsx`)

**Sidebar colapsable (desktop):**
- Expandido: 256px. Colapsado: ~64px (solo iconos).
- Header con logo "SPC" y gradiente institucional.
- 8 items de navegación con iconos Lucide: Dashboard, Programas, Acciones, Tableros, Capacitación, Asistente IA, Reportes, Configuración.
- Link inferior "Volver al sitio público".
- Estado activo con `.glow-accent` y fondo `sidebar-accent`.
- Botón de colapso con flecha.

**Top bar:**
- Botón hamburguesa (mobile) + botón colapso (desktop)
- ThemeToggle
- Campana de notificaciones con badge rojo animado (hardcoded "3")
- Dropdown usuario: avatar, nombre, email, rol, Configuración, Cerrar sesión

### 8.3 Gestión Layout — Ciudadanía Digital CMS (`components/layouts/gestion-layout.tsx`)

**Sidebar fijo (no colapsable):**
- Header con logo "CD" (gradiente primary→accent) + texto "Gestión / Ciudadanía Digital"
- 6 items: Dashboard, Usuarios, Trayectos, Contenidos, Encuestas, Reportes
- Link inferior "Volver a la plataforma" (→ `/ciudadania-digital`)

**Top bar:**
- ThemeToggle
- Campana con badge rojo "3" (animado)
- Dropdown usuario: avatar "AD", Settings → `/gestion/configuracion`, LogOut → `/ciudadania-digital`

### 8.4 Ciudadanía Layout (`components/layouts/ciudadania-layout.tsx`)

**Header:**
- Logo + "Ciudadanía Digital"
- Nav: Inicio, Trayectos, Contenidos (dropdown: Videos, Podcasts), Evaluaciones, Encuestas
- Acciones: ThemeToggle, dropdown cuenta (Mi Perfil, Certificados), botón Login

**Footer:**
- 4 columnas: Formación (Trayectos, Videos, Podcasts), Institucional (SPC, Contacto, Transparencia)

### 8.5 Dashboard Layout — Interno (`components/dashboard/DashboardLayout.tsx`)

**Header horizontal simple:**
- Nombre del usuario logueado
- Badge de rol con color diferenciado
- Botón Logout (POST `/api/auth/logout`)

**Navegación lateral:**
- Solo las rutas a las que el rol tiene acceso

---

## 9. Páginas y Componentes Principales

### 9.1 Home (`/inicio`)
Secciones en secuencia:
1. **HeroSection** — titular institucional, subtítulo, CTA principal y secundario, stats animadas (106 actividades, 17 municipios, 9.033 personas, 4 programas)
2. **ChallengeSection** — planteamiento del problema/contexto
3. **EcosystemSection** — diagrama visual de los 4 módulos integrados del sistema
4. **BenefitsSection** — ventajas clave del enfoque
5. **ScalabilitySection** — proyección de impacto

### 9.2 Programas (`/programas`)
- Buscador live + 4 filtros: Temática, Público, Territorio, Estado
- Grid de tarjetas (3 columnas lg): nombre, badge de estado, descripción, territorios (con overflow "+N más"), públicos, temáticas, botón "Ver detalle"
- 5 programas activos:
  1. **Juntos es más Seguro** — prevención comunitaria, seguridad ciudadana
  2. **Docentes Conectados** — capacitación digital docente
  3. **Familias en la Web** — parentalidad digital
  4. **Escuela de Ciudadanía** — formación cívica
  5. **GloPaC** — gobernanza local y participación

### 9.3 Acciones (`/acciones`)
- Toggle vista: Tarjetas / Tabla
- Búsqueda + 4 filtros: Programa, Municipio, Temática, Público
- Datos por acción: fecha, municipio/localidad, programa, temáticas, público, asistentes, duración, modalidad (presencial/virtual/híbrido)
- 10 acciones mock (marzo-abril 2026)

### 9.4 Ciudadanía Digital (`/ciudadania-digital`)
Página más elaborada visualmente:
1. **Hero** — fondo degradado sky-600→indigo-700, microparalaje con tracking del mouse, wave SVG decorativo
2. **¿Qué es?** — 4 cards: Derechos Digitales, Convivencia, Participación, Responsabilidad
3. **Cómo funciona** — 3 pasos con círculos numerados conectados por líneas degradadas
4. **Trayectos** — grid con 4 tarjetas, barras de progreso, badges de nivel y estado
5. **Contenidos** — 3 cards: Videos, Podcasts, Certificación con estadísticas
6. **Impacto** — fondo oscuro degradado, 4 métricas grandes con animaciones
7. **CTA final** — llamada a la acción para comenzar

### 9.5 Trayectos (`/trayectos`)
Cards de trayecto:
- Borde superior 3px en color del trayecto
- Badge de nivel (Inicial verde, Intermedio amarillo, Avanzado rojo/purple)
- Badge de progreso (Completado / En progreso)
- Stats: duración, cantidad de contenidos, módulos
- Barra de progreso si ya iniciado
- Preview de primeros 3 módulos
- Botón dinámico: "Comenzar" / "Continuar" / "Revisar"

**4 trayectos mock:**
1. Introducción a la Ciudadanía Digital (Inicial, 60-90 min, 9 contenidos, 3 módulos)
2. Convivencia y Violencias Digitales (Intermedio, 5 horas)
3. Cuidado en Internet y Redes Sociales (Inicial, 4.5 horas)
4. Participación Ciudadana en la Era Digital (Avanzado, 6 horas)

### 9.6 Dashboard Estadísticas (`/dashboard/estadisticas`)
- Filtro por año: 2025 / 2026 / Total
- 3 cards KPI: Actividades registradas, Personas alcanzadas, Promedio por actividad
- Tabla de últimas 10 actividades (fecha, programa, localidad, personas, cargado por)
- Fetch real a Supabase via `sbGetActividades()`
- Loading skeleton + manejo de errores
- Color brand custom `#4272bb` (no el primario del sistema)

### 9.7 Dashboard Admin (`/dashboard/admin`)
- `PanelAdmin`: embed iframe de MS Forms para carga de actividades
- Instrucciones de carga visibles al equipo

### 9.8 Gestión de Usuarios (`/dashboard/admin/usuarios`) — solo superadmin
- `CrearUsuarioForm`: formulario (nombre, email, contraseña, rol) con validación
- `ListaUsuarios`: tabla con columnas Nombre, Email, Rol, Estado (badge color), Email verificado (✓/✗), Acciones
  - Edición inline (dialog): puede cambiar nombre, rol, estado
  - Eliminación con confirmación (alert-dialog)
  - PATCH/DELETE a `/api/admin/usuarios/[email]`

---

## 10. Capa de Datos Mock

### `lib/mock/data.ts` — Datos de la plataforma pública

**Datos de referencia:**
- 8 temáticas: Prevención del Delito, Seguridad Ciudadana, Participación Comunitaria, Violencia de Género, Adicciones, Convivencia Urbana, Seguridad Vial, Mediación Comunitaria
- 8 públicos: Jóvenes, Adultos, Adultos Mayores, Familias, Instituciones Educativas, Organizaciones Barriales, Fuerzas de Seguridad, Funcionarios Públicos
- 10 territorios: San Miguel de Tucumán, Yerba Buena, Banda del Río Salí, Tafí Viejo, Concepción, Monteros, Famaillá, Aguilares, Alderetes, Las Talitas

**Exportaciones:**
- `programas: Programa[]` — 5 programas con objetivos, responsables, territorios, temáticas
- `acciones: Accion[]` — 10 acciones con fecha, asistentes, modalidad, devoluciones
- `videos: Video[]` — 5 videos (YouTube links)
- `materiales: Material[]` — 5 materiales (PDFs, presentaciones)
- `tableros: Tablero[]` — 4 tableros embebidos (Power BI / Looker / Metabase)
- `documentos: Documento[]` — 5 docs (informes anuales, planes estratégicos)
- `faqs: FAQ[]` — 5 preguntas frecuentes por categoría
- `kpisPublicos: KPI[]` — métricas públicas
- `kpisInternos: KPI[]` — métricas internas del equipo
- `alertas: Alerta[]` — 3 notificaciones del sistema
- `datosEvolucion: DatoEvolucion[]` — datos mensuales para gráfico de línea (marzo/abril)
- `datosPorTematica: DatoGrafico[]` / `datosPorTerritorio: DatoGrafico[]` — para charts de barras

### `lib/mock/ciudadania-data.ts` — Datos de la plataforma educativa

- `mockUsers: User[]` — 5 usuarios de prueba con fechas de registro
- `trayectos: Trayecto[]` — 4 trayectos con módulos completos (6-8 videos, 4-8 podcasts cada uno)
- `videos: VideoEducativo[]` — 13 videos con YouTube IDs, duración, texto educativo, etiquetas
- `podcasts: Podcast[]` — 9 episodios con Spotify IDs, invitados, duraciones
- `evaluaciones: Evaluacion[]` — 4 evaluaciones con preguntas tipo multiple choice, V/F y reflexivas
- `encuestas: Encuesta[]` — 4 encuestas (embeds Google Forms / Excel)
- `certificados: Certificado[]` — 4 certificados de ejemplo
- `mockEstadisticas` — objeto con todas las métricas del CMS: usuarios, trayectos completados, videos vistos, certificados, top videos, progreso semanal, distribución por nivel

---

## 11. Tipos TypeScript (`lib/types.ts` y `lib/types-ciudadania.ts`)

### Tipos principales (`lib/types.ts`)

```typescript
type EstadoPrograma = 'activo' | 'en_pausa' | 'finalizado'
type Modalidad = 'presencial' | 'virtual' | 'hibrido'

interface Programa {
  id, slug, nombre, descripcion, objetivos: string[],
  publicos: string[], territorios: string[], tematicas: string[],
  estado: EstadoPrograma, responsables: string[],
  fechaInicio: string, fechaFin?: string
}

interface Accion {
  id, fecha, municipio, localidad?, programaId, programaNombre,
  tematicaPrincipal, tematicasSecundarias?: string[],
  publico, cantidadAsistentes: number, duracionMinutos: number,
  modalidad: Modalidad, descripcion?, devoluciones?
}

interface KPI { id, titulo, valor: number | string, variacion?, descripcion?, icono? }
interface Alerta { id, tipo: 'warning'|'info'|'success'|'error', titulo, descripcion, fecha }
interface Video { id, titulo, descripcion, url, duracion, categoria, fecha }
interface Material { id, titulo, descripcion, tipo, url, fecha }
interface Tablero { id, titulo, descripcion, embedUrl, tipo }
interface Documento { id, titulo, descripcion, tipo, url, fecha, tamanio }
interface FAQ { id, pregunta, respuesta, categoria }
interface DatoGrafico { nombre: string, valor: number }
interface DatoEvolucion { mes: string, actividades: number, personas: number }
```

### Tipos ciudadanía (`lib/types-ciudadania.ts`)

```typescript
interface Trayecto {
  id, slug, titulo, descripcion, duracion, nivel: 'Inicial'|'Intermedio'|'Avanzado',
  modulos: Modulo[], requisitos: string[], evaluacionId: string,
  imagen, color, contenidosTotal: number, activo: boolean, recomendado?
}

interface Modulo { id, titulo, descripcion, videos: string[], podcasts: string[], orden: number }

interface VideoEducativo { id, titulo, descripcion, youtubeId, duracion, textoEducativo, etiquetas: string[], trayectoId, moduloId, orden }

interface Podcast { id, titulo, descripcion, spotifyId, duracion, invitado?, thumbnailUrl, etiquetas: string[], trayectoId, moduloId }

interface Evaluacion {
  id, titulo, trayectoId, preguntas: Pregunta[],
  tiempoEstimado: string, intentosPermitidos: number
}
type Pregunta = PreguntaMultiple | PreguntaVerdaderoFalso | PreguntaReflexiva

interface User {
  id, nombre, email, avatar: string|null, fechaRegistro: string,
  trayectosIniciados: string[], trayectosCompletados: string[],
  videosVistos: string[], evaluacionesRealizadas: string[], certificados: string[]
}

interface Certificado { id, titulo, usuarioId, trayectoId, fechaEmision, codigoVerificacion }
```

---

## 12. Componentes de UI Reutilizables

Todos en `components/ui/`. Son componentes shadcn/ui (no editar salvo bug). Los más usados:

- **Card, CardHeader, CardContent, CardTitle** — superficies estándar
- **Button** — variantes: `default`, `outline`, `ghost`, `destructive`, `link`
- **Badge** — etiquetas con variantes de color
- **Dialog / AlertDialog** — modales de acción y confirmación
- **DropdownMenu** — menús contextuales
- **Select, Input, Textarea, Label, Form** — formularios con react-hook-form + zod
- **Table** — tablas de datos
- **Skeleton** — loading states
- **Separator, Tabs, Sheet** — layout y navegación
- **Sonner / Toast** — notificaciones
- **ThemeToggle** — botón dark/light mode

**Componentes propios en `components/ui/`:**
- `kpi-stat-card.tsx` — tarjeta de KPI con valor, variación e ícono
- `filters-bar.tsx` — barra de filtros con selects y búsqueda
- `status-badge.tsx` — badge con colores según estado
- `tag-chips.tsx` — chips de etiquetas
- `alert-card.tsx` — tarjeta de alerta con tipo y mensaje
- `data-table.tsx` — tabla de datos genérica
- `empty-state.tsx` — estado vacío con ilustración/mensaje
- `page-header.tsx` — encabezado estándar de página con título y acciones
- `breadcrumbs.tsx` — migas de pan

---

## 13. Comandos de Desarrollo

```bash
npm run dev      # Servidor de desarrollo en http://localhost:3000
npm run build    # Build de producción
npm run start    # Servir el build de producción
npm run lint     # Ejecutar ESLint
```

No hay suite de tests configurada.

---

## 14. Convenciones del Proyecto

- **Idioma:** todo el texto de UI, nombres de variables de dominio, comentarios → **español**
- **`cn()`** de `@/lib/utils` para clases condicionales (clsx + tailwind-merge)
- **Server Components** por defecto en App Router. `"use client"` solo cuando se necesita interactividad.
- **No editar** `components/ui/` salvo bug — son componentes shadcn generados
- Datos reales solo en el dashboard interno. Todo lo demás usa mock.

---

## 15. Archivo HTML Standalone (`gestion-2026.html`)

Desplegado en `josefarhat.com/gestion-2026.html`. **Completamente independiente del app Next.js.**

- Stack: HTML + CSS/JS inline, CDN: Bootstrap 5, Font Awesome 6, Animate.css
- Mismo Supabase project y tabla `usuarios`. Passwords hasheadas con `crypto.subtle` (SHA256).
- Auth 100% client-side, sesión en `sessionStorage`
- Credenciales Supabase y Resend hardcodeadas en líneas ~335–337 (intencional para deploy estático)
- Contenido principal: embed iframe de MS Forms para carga de actividades
- Mismo flujo de autenticación que el app Next.js

---

## 16. Impacto Real (datos 2025)

Los datos en `seed-2025.sql` representan el trabajo real de la Secretaría durante 2025:

- **106 actividades** registradas (febrero a diciembre 2025)
- **9.033 personas** alcanzadas en total
- **Localidades atendidas:** San Miguel de Tucumán (SMT), Banda del Río Salí, Famaillá, Bella Vista, Concepción, Lules, y otras
- **Programas ejecutados:** Juntos es más Seguro, Familias en la Web, Docentes Conectados, Escuela de Ciudadanía, Vínculos Preventivos, GloPaC
- Los eventos más grandes superaron 800–1.250 personas (actividades masivas de Familias en la Web y Juntos es más Seguro)
