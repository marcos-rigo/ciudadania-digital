import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('gestion_session')

  if (!session) redirect('/login')

  try {
    const data = JSON.parse(session.value)
    redirect(data.rol === 'admin' ? '/dashboard/admin' : '/dashboard/estadisticas')
  } catch {
    redirect('/login')
  }
}
