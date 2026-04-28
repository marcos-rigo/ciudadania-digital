import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  hashPassword,
  sbGetUsuario,
  sbGetUsuarios,
  sbInsertUsuario,
} from '@/lib/auth-server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('gestion_session')

    // Verificar que el usuario es admin
    if (!session) {
      return NextResponse.json(
        { ok: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    try {
      const data = JSON.parse(session.value)
      if (data.rol !== 'admin') {
        return NextResponse.json(
          { ok: false, error: 'Solo administradores pueden crear usuarios' },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Sesión inválida' },
        { status: 401 }
      )
    }

    const { nombre, email: rawEmail, password, rol, estado = 'aprobado' } = await request.json()
    const email = rawEmail?.trim().toLowerCase()

    if (!nombre || !email || !password || !rol) {
      return NextResponse.json({
        ok: false,
        error: 'Completá nombre, email, contraseña y rol.',
      })
    }

    // Verificar que el email no existe
    const existing = await sbGetUsuario(email)

    if (existing.length > 0) {
      return NextResponse.json({
        ok: false,
        error: 'El email ya existe.',
      })
    }

    // Hashear password
    const passwordHash = hashPassword(password)

    // Insertar usuario
    const result = await sbInsertUsuario({
      nombre,
      email,
      password_hash: passwordHash,
      rol,
      estado,
      email_verificado: true,
    })

    return NextResponse.json({
      ok: true,
      mensaje: 'Usuario creado exitosamente',
      usuario: result[0] || { nombre, email, rol, estado },
    })
  } catch (e) {
    console.error('crear usuario error:', e)
    return NextResponse.json(
      {
        ok: false,
        error: `Error: ${e instanceof Error ? e.message : 'desconocido'}`,
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('gestion_session')

    // Verificar que el usuario es admin
    if (!session) {
      return NextResponse.json(
        { ok: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    try {
      const data = JSON.parse(session.value)
      if (data.rol !== 'admin') {
        return NextResponse.json(
          { ok: false, error: 'Solo administradores pueden ver usuarios' },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Sesión inválida' },
        { status: 401 }
      )
    }

    const usuarios = await sbGetUsuarios()

    return NextResponse.json({
      ok: true,
      usuarios,
    })
  } catch (e) {
    console.error('obtener usuarios error:', e)
    return NextResponse.json(
      {
        ok: false,
        error: `Error: ${e instanceof Error ? e.message : 'desconocido'}`,
      },
      { status: 500 }
    )
  }
}
