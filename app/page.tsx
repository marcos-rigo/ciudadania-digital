import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('gestion_session')

  if (!session) {
    redirect('/login')
  }

  try {
    const data = JSON.parse(session.value)
    if (data.rol === 'admin') {
      redirect('/dashboard/admin')
    } else {
      redirect('/dashboard/estadisticas')
    }
  } catch {
    redirect('/login')
  }
}
