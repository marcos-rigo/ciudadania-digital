import { NextResponse } from 'next/server'
import { sbGetUsuarios, sbDeleteUsuario, sbInsertUsuario } from '@/lib/auth-server'

// Endpoint de migración de un solo uso — actualiza emails de superadmin y empleado
// preservando sus password_hash actuales en la BD.
export async function GET() {
  try {
    const todos = await sbGetUsuarios() as Record<string, string>[]

    const superadmin = todos.find(u => u.rol === 'superadmin')
    const empleado   = todos.find(u => u.rol === 'empleado')

    const resultados: Record<string, string>[] = []

    // ── Superadmin: marcos.rigo.10@gmail.com, nombre Marcos Rigo ──
    if (superadmin) {
      await sbDeleteUsuario(superadmin.email)
      await sbInsertUsuario({
        nombre:            'Marcos Rigo',
        email:             'marcos.rigo.10@gmail.com',
        password_hash:     superadmin.password_hash,
        rol:               'superadmin',
        estado:            'aprobado',
        email_verificado:  true,
      })
      resultados.push({ rol: 'superadmin', ok: 'actualizado', email_anterior: superadmin.email, email_nuevo: 'marcos.rigo.10@gmail.com' })
    } else {
      resultados.push({ rol: 'superadmin', ok: 'no encontrado' })
    }

    // ── Empleado: tanda1290@gmail.com, mismo nombre y contraseña ──
    if (empleado) {
      await sbDeleteUsuario(empleado.email)
      await sbInsertUsuario({
        nombre:            empleado.nombre || 'Empleado',
        email:             'tanda1290@gmail.com',
        password_hash:     empleado.password_hash,
        rol:               'empleado',
        estado:            'aprobado',
        email_verificado:  true,
      })
      resultados.push({ rol: 'empleado', ok: 'actualizado', email_anterior: empleado.email, email_nuevo: 'tanda1290@gmail.com' })
    } else {
      resultados.push({ rol: 'empleado', ok: 'no encontrado' })
    }

    return NextResponse.json({ ok: true, resultados })
  } catch (e) {
    console.error('migrate error:', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
