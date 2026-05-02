import {
  BarChart3,
  MapPin,
  ClipboardCheck,
  FileBarChart,
  Clock,
  ShieldCheck,
} from "lucide-react"

const benefits = [
  {
    icon: BarChart3,
    title: "Decisiones basadas en datos reales",
    description:
      "Indicadores actualizados en tiempo real que permiten a los decisores institucionales actuar con información concreta del territorio.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    hover: "hover:border-blue-200",
  },
  {
    icon: MapPin,
    title: "Trazabilidad territorial completa",
    description:
      "Registro detallado de cada acción por municipio, localidad y programa, con historial completo de intervenciones y personas alcanzadas.",
    color: "bg-violet-50 text-violet-600 border-violet-100",
    hover: "hover:border-violet-200",
  },
  {
    icon: ClipboardCheck,
    title: "Optimización de procesos internos",
    description:
      "Flujos de carga de datos estandarizados que reducen la carga administrativa y garantizan consistencia en toda la organización.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    hover: "hover:border-emerald-200",
  },
  {
    icon: FileBarChart,
    title: "Reportes automáticos de impacto",
    description:
      "Generación automática de informes de gestión periódicos con los indicadores clave, listos para presentar a autoridades y equipos.",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    hover: "hover:border-amber-200",
  },
  {
    icon: Clock,
    title: "Monitoreo continuo de resultados",
    description:
      "Seguimiento en tiempo real del avance de cada programa, con alertas y dashboards que muestran el estado actual de la gestión.",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    hover: "hover:border-cyan-200",
  },
  {
    icon: ShieldCheck,
    title: "Control y transparencia institucional",
    description:
      "Acceso seguro por roles con auditoría de cambios, garantizando la integridad de los datos y la rendición de cuentas interna.",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    hover: "hover:border-rose-200",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-100 via-violet-100 to-blue-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-divider mb-6" />
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Beneficios para la Gestión Institucional
          </h2>
          <p className="text-lg text-slate-500">
            Herramientas diseñadas para optimizar la operación interna de la Secretaría
            y potenciar el impacto territorial de cada acción.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className={`group relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm
                  transition-all duration-300 hover:-translate-y-1
                  hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]
                  ${benefit.hover}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-sm
                      transition-transform duration-200 group-hover:scale-110 ${benefit.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 leading-snug text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
