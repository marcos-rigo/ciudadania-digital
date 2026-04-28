import { AuthLayout } from '@/components/auth/AuthLayout'
import { ResetForm } from '@/components/auth/ResetForm'

export const metadata = { title: 'Recuperar contraseña · Gestión 2026' }

export default function ResetPage() {
  return (
    <AuthLayout>
      <ResetForm />
    </AuthLayout>
  )
}
