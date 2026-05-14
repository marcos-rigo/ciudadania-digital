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
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    hover: "hover:border-cyan-500/50 hover:bg-cyan-500/5",
  },
  {
    icon: MapPin,
    title: "Trazabilidad territorial completa",
    description:
      "Registro detallado de cada acción por municipio, localidad y programa, con historial completo de intervenciones y personas alcanzadas.",
    color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    hover: "hover:border-violet-500/50 hover:bg-violet-500/5",
  },
  {
    icon: ClipboardCheck,
    title: "Optimización de procesos internos",
    description:
      "Flujos de carga de datos estandarizados que reducen la carga administrativa y garantizan consistencia en toda la organización.",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    hover: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
  },
  {
    icon: FileBarChart,
    title: "Reportes automáticos de impacto",
    description:
      "Generación automática de informes de gestión periódicos con los indicadores clave, listos para presentar a autoridades y equipos.",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    hover: "hover:border-amber-500/50 hover:bg-amber-500/5",
  },
  {
    icon: Clock,
    title: "Monitoreo continuo de resultados",
    description:
      "Seguimiento en tiempo real del avance de cada programa, con alertas y dashboards que muestran el estado actual de la gestión.",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    hover: "hover:border-cyan-500/50 hover:bg-cyan-500/5",
  },
  {
    icon: ShieldCheck,
    title: "Control y transparencia institucional",
    description:
      "Acceso seguro por roles con auditoría de cambios, garantizando la integridad de los datos y la rendición de cuentas interna.",
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    hover: "hover:border-rose-500/50 hover:bg-rose-500/5",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-24 bg-[#050810] relative overflow-hidden">
      {/* Grid & Glows */}
      <div className="bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-divider mb-6" />
          <h2 className="text-3xl sm:text-4xl font-black text-slate-100 mb-4">
            Beneficios para la Gestión Institucional
          </h2>
          <p className="text-lg text-slate-400">
            Herramientas diseñadas para optimizar la operación interna de la Secretaría
            y potenciar el impacto territorial de cada acción.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className={`group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50
                  card-glow transition-all duration-300 hover:-translate-y-1
                  ${benefit.hover}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-lg backdrop-blur-sm
                      transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 ${benefit.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 mb-2 leading-snug text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
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