import { Monitor, FileBarChart, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const futureItems = [
  {
    icon: Monitor,
    title: "Portal Ciudadano",
    description:
      "Espacio de participación directa para que ciudadanos consulten programas, soliciten actividades y brinden retroalimentación.",
  },
  {
    icon: FileBarChart,
    title: "Reportes Automáticos",
    description:
      "Generación programada de informes periódicos con indicadores clave, distribución automática a decisores.",
  },
  {
    icon: Award,
    title: "Certificaciones",
    description:
      "Sistema de certificación digital para participantes de capacitaciones y programas de formación.",
  },
]

export function ScalabilitySection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
         

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center p-8 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="text-left">
                <h3 className="font-semibold text-foreground">
                  ¿Querés conocer más sobre nuestros programas?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explorá las acciones que estamos llevando adelante en todo el territorio.
                </p>
              </div>
              <Button asChild>
                <Link href="/programas">
                  Ver Programas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
