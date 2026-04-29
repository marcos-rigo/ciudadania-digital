const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
}

export async function sbGetActividades(filtros: string): Promise<Record<string, unknown>[]> {
  const url = `${SB_URL}/rest/v1/actividades?${filtros}`
  const r = await fetch(url, { headers, cache: 'no-store' })
  if (!r.ok) {
    const texto = await r.text()
    throw new Error(`Supabase ${r.status}: ${texto}`)
  }
  return r.json()
}
