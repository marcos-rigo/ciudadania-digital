import { NextResponse } from 'next/server'
import { sbGetUsuario, enviarEmail } from '@/lib/auth-server'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_EMAIL_ADMIN || 'marcos.rigo.10@gmail.com'

function tplSolicitudReset(nombre: string, email: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#1A2A36;margin-bottom:8px;">Solicitud de restablecimiento de contraseña</h2>
      <p style="color:#64748b;font-size:14px;margin-bottom:24px;">Un usuario solicitó restablecer su contraseña en el sistema de Gestión SPC.</p>
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#374151;"><strong>Nombre:</strong> ${nombre}</p>
        <p style="margin:0;font-size:13px;color:#374151;"><strong>Email:</strong> ${email}</p>
      </div>
      <p style="color:#64748b;font-size:13px;">Por favor, establecé una nueva contraseña para este usuario desde el panel de administración y comunicásela por email.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
      <p style="color:#94a3b8;font-size:11px;text-align:center;">Gestión SPC · Secretaría de Participación Ciudadana · Tucumán</p>
    </div>
  `
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body.email?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email requerido.' })
    }

    // Buscar usuario — siempre devuelve ok para no revelar si el email existe
    const rows = await sbGetUsuario(email)
    if (rows.length) {
      const nombre = String(rows[0].nombre || email)
      await enviarEmail(
        ADMIN_EMAIL,
        `Solicitud de nueva contraseña · ${nombre}`,
        tplSolicitudReset(nombre, email)
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('reset error:', e)
    return NextResponse.json({ ok: false, error: 'Error. Intentá de nuevo.' })
  }
}
