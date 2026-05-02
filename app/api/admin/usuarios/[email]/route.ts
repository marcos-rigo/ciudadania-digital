import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sbUpdateUsuario, sbDeleteUsuario, hashPassword } from '@/lib/auth-server'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('gestion_session')
  if (!session) return false
  try {
    const data = JSON.parse(session.value)
    return data.rol === 'superadmin'
  } catch {
    return false
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  if (!(await verificarAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 403 })
  }

  const { email } = await params
  const emailDecoded = decodeURIComponent(email)

  try {
    const body = await request.json()
    const campos: Record<string, string> = {}

    if (body.nombre) campos.nombre = body.nombre
    if (body.rol) campos.rol = body.rol
    if (body.estado) campos.estado = body.estado
    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json({ ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' })
      }
      campos.password_hash = hashPassword(body.password)
    }

    if (Object.keys(campos).length === 0) {
      return NextResponse.json({ ok: false, error: 'No hay campos para actualizar.' })
    }

    await sbUpdateUsuario(emailDecoded, campos)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  if (!(await verificarAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 403 })
  }

  const { email } = await params
  const emailDecoded = decodeURIComponent(email)

  try {
    await sbDeleteUsuario(emailDecoded)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
