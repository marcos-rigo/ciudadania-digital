import { AuthLayout } from '@/components/auth/AuthLayout'
import { RegistroForm } from '@/components/auth/RegistroForm'

export const metadata = { title: 'Crear cuenta · Gestión 2026' }

export default function RegistroPage() {
  return (
    <AuthLayout>
      <RegistroForm />
    </AuthLayout>
  )
}
