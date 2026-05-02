import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  hashPassword,
  sbGetUsuario,
  sbUpdateUsuario,
  generarCodigo,
  expiraEn,
  enviarEmail,
  tplVerificacion,
} from '@/lib/auth-server'

export async function POST(request: Request) {
  try {
    const { email: rawEmail, password } = await request.json()
    const email = rawEmail?.trim().toLowerCase()

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Completá email y contraseña.' })
    }

    const hash = hashPassword(password)
    const rows = await sbGetUsuario(email)

    if (!rows.length || rows[0].password_hash !== hash) {
      return NextResponse.json({ ok: false, error: 'Email o contraseña incorrectos.' })
    }

    const u = rows[0]

    if (!u.email_verificado) {
      const codigo = generarCodigo()
      await sbUpdateUsuario(email, { codigo_verificacion: codigo, codigo_expira: expiraEn(15) })
      await enviarEmail(email, 'Verificá tu email · Gestión 2026', tplVerificacion(String(u.nombre), codigo))
      return NextResponse.json({ ok: false, verificar: true, email })
    }

    if (u.estado === 'pendiente') {
      return NextResponse.json({ ok: false, pendiente: true })
    }

    if (u.estado === 'rechazado') {
      return NextResponse.json({ ok: false, error: 'Tu acceso fue rechazado. Contactá al administrador.' })
    }

    if (u.estado !== 'aprobado') {
      return NextResponse.json({ ok: false, error: 'Tu cuenta no está aprobada. Contactá al administrador.' })
    }

    const rol = String(u.rol || 'lector')
    const nombre = String(u.nombre)

    const cookieStore = await cookies()
    cookieStore.set('gestion_session', JSON.stringify({ auth: true, nombre, rol }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    // Cookie legible por JS para mostrar/ocultar items de nav en el cliente
    cookieStore.set('spc_auth', '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ ok: true, rol, nombre })
  } catch (e) {
    console.error('login error:', e)
    return NextResponse.json({ ok: false, error: 'Error de conexión. Intentá de nuevo.' })
  }
}
