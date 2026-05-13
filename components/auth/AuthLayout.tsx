import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-auth-premium">
      {/* Back button */}
      <div className="px-6 pt-5 relative z-10">
        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[440px] bg-white/96 backdrop-blur-sm rounded-2xl px-6 py-10 sm:px-10 sm:py-12 shadow-[0_16px_64px_rgba(43,84,194,.16),0_4px_20px_rgba(15,23,42,.08)] border border-blue-100/70">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/50 bg-white/40 backdrop-blur-sm relative z-10">
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
