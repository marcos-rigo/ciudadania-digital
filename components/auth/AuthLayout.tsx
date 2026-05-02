import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Accent bar top */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />

      {/* Back button */}
      <div className="px-6 pt-5">
        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px] bg-white rounded-[20px] px-10 py-12 shadow-[0_8px_40px_rgba(37,99,235,.10)] border border-slate-200">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} José Farhat. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <div className="relative h-10 w-36">
                <Image src="/logo1.png" alt="SPC Tucumán" fill className="object-contain" />
              </div>
              <div className="relative h-10 w-36">
                <Image src="/logo2.png" alt="Gobierno de Tucumán" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
