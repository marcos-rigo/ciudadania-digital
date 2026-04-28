import { cookies } from 'next/headers'
import { PanelEstadisticas } from '@/components/dashboard/PanelEstadisticas'

export const metadata = { title: 'Estadísticas · Gestión 2026' }

export default async function EstadisticasPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('gestion_session')

  let rol = 'lector'
  try {
    const data = JSON.parse(session?.value || '{}')
    rol = data.rol || 'lector'
  } catch {}

  return <PanelEstadisticas rol={rol} />
}
