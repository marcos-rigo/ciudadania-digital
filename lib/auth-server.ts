import crypto from 'crypto'

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function generarCodigo(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function expiraEn(minutos: number): string {
  return new Date(Date.now() + minutos * 60000).toISOString()
}

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!

const sbHeaders = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  'Content-Type': 'application/json',
}

export async function sbGetUsuario(email: string): Promise<Record<string, unknown>[]> {
  const url = new URL(`${SB_URL}/rest/v1/usuarios`)
  url.searchParams.append('email', `eq.${email}`)
  
  const r = await fetch(url.toString(), {
    headers: sbHeaders,
    cache: 'no-store',
  })
  
  if (!r.ok) {
    const text = await r.text()
    console.error('Supabase response:', text)
    throw new Error(`Supabase error ${r.status}: ${text}`)
  }
  return r.json()
}

export async function sbGetUsuarios(): Promise<Record<string, unknown>[]> {
  const url = new URL(`${SB_URL}/rest/v1/usuarios`)
  
  const r = await fetch(url.toString(), {
    headers: sbHeaders,
    cache: 'no-store',
  })
  
  if (!r.ok) {
    const text = await r.text()
    console.error('Supabase response:', text)
    throw new Error(`Supabase error ${r.status}: ${text}`)
  }
  return r.json()
}

export async function sbInsertUsuario(data: object) {
  const r = await fetch(`${SB_URL}/rest/v1/usuarios`, {
    method: 'POST',
    headers: { ...sbHeaders, Prefer: 'return=representation' },
    body: JSON.stringify(data),
  })
  if (!r.ok) {
    const texto = await r.text()
    throw new Error(`Supabase insert ${r.status}: ${texto}`)
  }
  return r.json()
}

export async function sbUpdateUsuario(email: string, data: object): Promise<boolean> {
  const r = await fetch(
    `${SB_URL}/rest/v1/usuarios?email=eq.${encodeURIComponent(email)}`,
    { method: 'PATCH', headers: sbHeaders, body: JSON.stringify(data) }
  )
  return r.ok
}

export async function enviarEmail(to: string, subject: string, html: string) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: process.env.NEXT_PUBLIC_EMAIL_FROM, to, subject, html }),
    })
  } catch (e) {
    console.warn('Email no enviado:', e)
  }
}

export function tplVerificacion(nombre: string, codigo: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;"><div style="background:#1A2A36;padding:24px;border-radius:12px 12px 0 0;text-align:center;"><h2 style="color:#fff;margin:0;font-size:1.2rem;">Secretaría de Participación Ciudadana</h2></div><div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;"><p style="color:#1A2A36;">Hola <strong>${nombre}</strong>,</p><p style="color:#4a5568;">Tu código de verificación es:</p><div style="text-align:center;margin:24px 0;"><span style="font-size:2.5rem;font-weight:900;letter-spacing:.3em;color:#4272bb;">${codigo}</span></div><p style="color:#94a3b8;font-size:.82rem;">Expira en 15 minutos.</p></div></div>`
}

export function tplReset(codigo: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;"><div style="background:#1A2A36;padding:24px;border-radius:12px 12px 0 0;text-align:center;"><h2 style="color:#fff;margin:0;">Recuperar contraseña</h2></div><div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;"><p style="color:#4a5568;">Tu código para restablecer la contraseña:</p><div style="text-align:center;margin:24px 0;"><span style="font-size:2.5rem;font-weight:900;letter-spacing:.3em;color:#6366f1;">${codigo}</span></div><p style="color:#94a3b8;font-size:.82rem;">Expira en 15 minutos.</p></div></div>`
}
