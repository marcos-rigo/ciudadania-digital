import Link from 'next/link'
import { Clock } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const metadata = { title: 'Pendiente de aprobación · Gestión 2026' }

export default function PendientePage() {
  return (
    <AuthLayout>
      <div className="text-center">
        <div className="w-14 h-14 bg-[#f59e0b] rounded-[14px] flex items-center justify-center mx-auto mb-3">
          <Clock className="text-white w-7 h-7" />
        </div>
        <h2 className="text-[#1A2A36] text-xl font-black mb-1">Solicitud enviada</h2>
        <p className="text-[#64748b] text-xs mb-5">Tu email fue verificado correctamente</p>
        <p className="text-[#4a5568] text-sm leading-relaxed mb-6">
          Tu cuenta está siendo revisada por el administrador.
          <br />
          Recibirás un email cuando tu acceso sea <strong>aprobado</strong>.
        </p>
        <span className="inline-block bg-yellow-100 text-yellow-800 border border-yellow-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
          ⏳ Pendiente de aprobación
        </span>
        <div>
          <Link href="/login" className="text-[#4272bb] text-xs font-semibold hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
