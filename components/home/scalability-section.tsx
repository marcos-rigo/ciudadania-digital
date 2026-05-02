import { ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ScalabilitySection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* CTA Premium */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-8 sm:p-12 text-white shadow-xl">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-4 right-32 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center justify-between">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-semibold mb-4">
                  <Lock className="h-3.5 w-3.5" />
                  Acceso restringido al equipo interno
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
                  ¿Listo para gestionar los resultados?
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed max-w-sm">
                  Accedé al panel de carga, estadísticas y tableros de control del sistema de gestión 2026.
                </p>
              </div>

              <div className="shrink-0">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
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
