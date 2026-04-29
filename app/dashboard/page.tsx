import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('gestion_session')

  if (!session) redirect('/login')

  try {
    const data = JSON.parse(session.value)
    if (data.rol === 'superadmin') redirect('/dashboard/admin/usuarios')
    else if (data.rol === 'empleado') redirect('/dashboard/admin')
    else redirect('/dashboard/estadisticas')
  } catch {
    redirect('/login')
  }
}
