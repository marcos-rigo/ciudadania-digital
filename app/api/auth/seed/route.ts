import { NextResponse } from 'next/server'
import {
  hashPassword,
  sbGetUsuario,
  sbInsertUsuario,
} from '@/lib/auth-server'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { ok: false, error: 'No disponible en producción' },
      { status: 403 }
    )
  }

  try {
    const usuariosSeeds = [
      {
        nombre: 'Superadministrador',
        email: 'superadmin@participacionciudadana.gob.ar',
        password: 'Superadmin2026!',
        rol: 'superadmin',
        estado: 'aprobado',
        email_verificado: true,
      },
      {
        nombre: 'Empleado',
        email: 'empleado@participacionciudadana.gob.ar',
        password: 'Empleado2026!',
        rol: 'empleado',
        estado: 'aprobado',
        email_verificado: true,
      },
      {
        nombre: 'Lector',
        email: 'lector@participacionciudadana.gob.ar',
        password: 'Lector2026!',
        rol: 'lector',
        estado: 'aprobado',
        email_verificado: true,
      },
    ]

    const resultados = []

    for (const seed of usuariosSeeds) {
      try {
        const existing = await sbGetUsuario(seed.email)

        if (existing.length > 0) {
          resultados.push({ email: seed.email, ok: false, mensaje: 'Usuario ya existe' })
          continue
        }

        const passwordHash = hashPassword(seed.password)

        await sbInsertUsuario({
          nombre: seed.nombre,
          email: seed.email,
          password_hash: passwordHash,
          rol: seed.rol,
          estado: seed.estado,
          email_verificado: seed.email_verificado,
        })

        resultados.push({ email: seed.email, ok: true, mensaje: 'Usuario creado exitosamente' })
      } catch (err) {
        resultados.push({
          email: seed.email,
          ok: false,
          mensaje: `Error: ${err instanceof Error ? err.message : 'desconocido'}`,
        })
      }
    }

    return NextResponse.json({ ok: true, resultados })
  } catch (e) {
    console.error('seed error:', e)
    return NextResponse.json(
      { ok: false, error: `Error: ${e instanceof Error ? e.message : 'desconocido'}` },
      { status: 500 }
    )
  }
}
