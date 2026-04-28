import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('gestion_session')
  const { pathname } = request.nextUrl

  // Proteger /dashboard/**
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      JSON.parse(session.value)
    } catch {
      const res = NextResponse.redirect(new URL('/login', request.url))
      res.cookies.delete('gestion_session')
      return res
    }
  }

  // Redirigir usuarios autenticados desde /login
  if (pathname === '/login' && session) {
    try {
      const data = JSON.parse(session.value)
      const target = data.rol === 'admin' ? '/dashboard/admin' : '/dashboard/estadisticas'
      return NextResponse.redirect(new URL(target, request.url))
    } catch {
      // cookie inválida → dejar ir al login
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}
