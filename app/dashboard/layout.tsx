import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('gestion_session')

  if (!session) redirect('/login')

  let nombre = 'Usuario'
  let rol = 'lector'

  try {
    const data = JSON.parse(session.value)
    nombre = data.nombre || 'Usuario'
    rol = data.rol || 'admin'
  } catch {
    redirect('/login')
  }

  return (
    <DashboardLayout nombre={nombre} rol={rol}>
      {children}
    </DashboardLayout>
  )
}
