import { NextResponse } from 'next/server'
import {
  hashPassword,
  sbGetUsuario,
  sbUpdateUsuario,
  generarCodigo,
  expiraEn,
  enviarEmail,
  tplReset,
} from '@/lib/auth-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email: rawEmail, codigo, nuevaPassword } = body
    const email = rawEmail?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email requerido.' })
    }

    // Paso 2: cambiar contraseña
    if (codigo && nuevaPassword) {
      if (nuevaPassword.length < 8) {
        return NextResponse.json({ ok: false, error: 'Mínimo 8 caracteres.' })
      }
      const rows = await sbGetUsuario(email)
      if (!rows.length || rows[0].codigo_reset !== codigo) {
        return NextResponse.json({ ok: false, error: 'Código incorrecto.' })
      }
      if (new Date(String(rows[0].reset_expira)) < new Date()) {
        return NextResponse.json({ ok: false, error: 'El código expiró. Solicitá uno nuevo.' })
      }
      const hash = hashPassword(nuevaPassword)
      await sbUpdateUsuario(email, { password_hash: hash, codigo_reset: null, reset_expira: null })
      return NextResponse.json({ ok: true })
    }

    // Paso 1: solicitar código (siempre responde ok para no revelar emails existentes)
    const rows = await sbGetUsuario(email)
    if (rows.length) {
      const cod = generarCodigo()
      await sbUpdateUsuario(email, { codigo_reset: cod, reset_expira: expiraEn(15) })
      await enviarEmail(email, 'Recuperar contraseña · Gestión 2026', tplReset(cod))
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('reset error:', e)
    return NextResponse.json({ ok: false, error: 'Error. Intentá de nuevo.' })
  }
}
