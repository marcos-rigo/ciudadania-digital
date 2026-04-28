import { NextResponse } from 'next/server'
import { sbGetUsuario, sbUpdateUsuario, generarCodigo, expiraEn, enviarEmail, tplVerificacion } from '@/lib/auth-server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ ok: false, error: 'Email requerido.' })

    const rows = await sbGetUsuario(email)
    if (!rows.length) return NextResponse.json({ ok: false, error: 'Email no encontrado.' })

    const codigo = generarCodigo()
    await sbUpdateUsuario(email, { codigo_verificacion: codigo, codigo_expira: expiraEn(15) })
    await enviarEmail(
      email,
      'Nuevo código de verificación · Gestión 2026',
      tplVerificacion(String(rows[0].nombre), codigo)
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('reenviar error:', e)
    return NextResponse.json({ ok: false, error: 'Error al reenviar.' })
  }
}
