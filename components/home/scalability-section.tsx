import { ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ScalabilitySection() {
  return (
    <section className="py-20 bg-[#050810] relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* CTA Premium */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1220] via-[#151d2e] to-[#1a1625] border border-cyan-500/20 p-8 sm:p-12 text-white shadow-2xl shadow-cyan-500/5">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/5 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-violet-500/5 pointer-events-none" />
            <div className="absolute top-4 right-32 w-24 h-24 rounded-full bg-cyan-500/5 pointer-events-none" />
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid opacity-10" />

            <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center justify-between">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-sm font-semibold mb-4 backdrop-blur-sm">
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-cyan-300">Acceso restringido al equipo interno</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-2 text-slate-100">
                  ¿Listo para gestionar los resultados?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                  Accedé al panel de carga, estadísticas y tableros de control del sistema de gestión 2026.
                </p>
              </div>

              <div className="shrink-0">
                <Button
                  asChild
                  size="lg"
                  className="bg-cyan-500 text-slate-900 hover:bg-cyan-400 font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 border-0"
                >
                  <Link href="/login">
                    Ingresar al sistema
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}