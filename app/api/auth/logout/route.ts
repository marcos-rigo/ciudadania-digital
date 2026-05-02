import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('gestion_session')
  cookieStore.delete('spc_auth')
  return NextResponse.json({ ok: true })
}
