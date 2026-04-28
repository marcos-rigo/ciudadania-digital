import { Suspense } from 'react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { VerificarForm } from '@/components/auth/VerificarForm'

export const metadata = { title: 'Verificar email · Gestión 2026' }

export default function VerificarPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="text-center py-8 text-[#64748b] text-sm">
            <span className="w-5 h-5 border-2 border-[#e2e8f0] border-t-[#4272bb] rounded-full animate-spin inline-block" />
          </div>
        }
      >
        <VerificarForm />
      </Suspense>
    </AuthLayout>
  )
}
