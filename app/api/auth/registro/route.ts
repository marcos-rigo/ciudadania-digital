import { NextResponse } from 'next/server'
import {
  hashPassword,
  sbGetUsuario,
  sbInsertUsuario,
  generarCodigo,
  expiraEn,
  enviarEmail,
  tplVerificacion,
} from '@/lib/auth-server'

export async function POST(request: Request) {
  try {
    const { nombre, email: rawEmail, password } = await request.json()
    const email = rawEmail?.trim().toLowerCase()

    if (!nombre || !email || !password) {
      return NextResponse.json({ ok: false, error: 'Completá todos los campos.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'El email no es válido.' })
    }
    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: 'La contraseña debe tener al menos 8 caracteres.' })
    }

    const existing = await sbGetUsuario(email)
    if (existing.length > 0) {
      return NextResponse.json({ ok: false, error: 'Este email ya está registrado.' })
    }

    const hash = hashPassword(password)
    const codigo = generarCodigo()

    await sbInsertUsuario({
      nombre,
      email,
      password_hash: hash,
      estado: 'pendiente',
      email_verificado: false,
      codigo_verificacion: codigo,
      codigo_expira: expiraEn(15),
    })

    const emailAdmin = process.env.NEXT_PUBLIC_EMAIL_ADMIN!
    await Promise.all([
      enviarEmail(email, 'Verificá tu email · Gestión 2026', tplVerificacion(nombre, codigo)),
      enviarEmail(
        emailAdmin,
        `Nuevo usuario pendiente: ${nombre}`,
        `<p><strong>${nombre}</strong> (${email}) se registró y espera aprobación. Ingresá a Supabase para aprobarlo.</p>`
      ),
    ])

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('registro error:', e)
    return NextResponse.json({ ok: false, error: 'Error al registrar. Intentá de nuevo.' })
  }
}
