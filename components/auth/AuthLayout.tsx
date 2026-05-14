import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Sparkles } from 'lucide-react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-auth-premium relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
      
      {/* Back button */}
      <div className="px-6 pt-5 relative z-10">
        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[440px] bg-[#0d1220]/95 backdrop-blur-xl rounded-2xl px-6 py-10 sm:px-10 sm:py-12 shadow-[0_16px_64px_rgba(0,0,0,0.5),0_4px_20px_rgba(0,0,0,0.3)] border border-slate-800/50">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-[#050810]/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} José Farhat. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <div className="relative h-10 w-36 opacity-70">
                <Image src="/logo1.png" alt="SPC Tucumán" fill className="object-contain" />
              </div>
              <div className="relative h-10 w-36 opacity-70">
                <Image src="/logo2.png" alt="Gobierno de Tucumán" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}