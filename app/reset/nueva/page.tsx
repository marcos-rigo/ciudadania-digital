import { Suspense } from 'react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { ResetNuevaForm } from '@/components/auth/ResetNuevaForm'

export const metadata = { title: 'Nueva contraseña · Gestión 2026' }

export default function ResetNuevaPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="text-center py-8 text-[#64748b] text-sm">
            <span className="w-5 h-5 border-2 border-[#e2e8f0] border-t-[#6366f1] rounded-full animate-spin inline-block" />
          </div>
        }
      >
        <ResetNuevaForm />
      </Suspense>
    </AuthLayout>
  )
}
