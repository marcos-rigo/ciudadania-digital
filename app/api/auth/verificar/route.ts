import { NextResponse } from 'next/server'
import { sbGetUsuario, sbUpdateUsuario } from '@/lib/auth-server'

export async function POST(request: Request) {
  try {
    const { email, codigo } = await request.json()

    if (!email || !codigo || String(codigo).length !== 6) {
      return NextResponse.json({ ok: false, error: 'Ingresá los 6 dígitos.' })
    }

    const rows = await sbGetUsuario(email)

    if (!rows.length) {
      return NextResponse.json({ ok: false, error: 'No se encontró el usuario.' })
    }

    const u = rows[0]

    if (new Date(String(u.codigo_expira)) < new Date()) {
      return NextResponse.json({ ok: false, error: 'El código expiró. Reenvialo.', expirado: true })
    }

    if (u.codigo_verificacion !== codigo) {
      return NextResponse.json({ ok: false, error: 'Código incorrecto.' })
    }

    await sbUpdateUsuario(email, {
      email_verificado: true,
      codigo_verificacion: null,
      codigo_expira: null,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('verificar error:', e)
    return NextResponse.json({ ok: false, error: 'Error al verificar. Intentá de nuevo.' })
  }
}
