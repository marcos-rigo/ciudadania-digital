const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
}

export async function sbGetActividades(filtros: string): Promise<Record<string, unknown>[]> {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/actividades?${filtros}`, { headers })
    if (!r.ok) return []
    return r.json()
  } catch {
    return []
  }
}
