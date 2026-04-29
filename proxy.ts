import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLES_VALIDOS = ['superadmin', 'empleado', 'lector'] as const

function getRol(request: NextRequest): string | null {
  const session = request.cookies.get('gestion_session')
  if (!session) return null
  try {
    return JSON.parse(session.value).rol ?? null
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('gestion_session')

  // --- Proteger /dashboard/** ---
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    let rol: string
    try {
      rol = JSON.parse(session.value).rol ?? ''
    } catch {
      const res = NextResponse.redirect(new URL('/login', request.url))
      res.cookies.delete('gestion_session')
      return res
    }

    // Cookie con rol no reconocido (ej: cookie vieja con 'admin') → limpiar y redirigir
    if (!ROLES_VALIDOS.includes(rol as (typeof ROLES_VALIDOS)[number])) {
      const res = NextResponse.redirect(new URL('/login', request.url))
      res.cookies.delete('gestion_session')
      return res
    }

    // Solo superadmin puede gestionar usuarios
    if (pathname.startsWith('/dashboard/admin/usuarios') && rol !== 'superadmin') {
      return NextResponse.redirect(new URL('/dashboard/estadisticas', request.url))
    }

    // lector no puede ver el panel de carga
    if (pathname === '/dashboard/admin' && rol === 'lector') {
      return NextResponse.redirect(new URL('/dashboard/estadisticas', request.url))
    }
  }

  // --- Redirigir usuarios autenticados desde /login ---
  if (pathname === '/login' && session) {
    const rol = getRol(request)
    // Solo redirigir si el rol es reconocido; si no, dejar pasar (cookie vieja se limpiará)
    if (rol && ROLES_VALIDOS.includes(rol as (typeof ROLES_VALIDOS)[number])) {
      let target = '/dashboard/estadisticas'
      if (rol === 'superadmin') target = '/dashboard/admin/usuarios'
      else if (rol === 'empleado') target = '/dashboard/admin'
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}
