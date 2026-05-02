"use client"

import { motion } from "framer-motion"
import { UploadCloud, Activity, LayoutDashboard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const modules = [
  {
    icon: UploadCloud,
    title: "Carga de Datos Operativos",
    description: "Registro territorial",
    details:
      "Sistema centralizado de carga de actividades, capacitaciones y acciones territoriales. Integración directa con formularios operativos para un registro ágil y trazable.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    borderHover: "hover:border-blue-300",
    shadowHover: "hover:shadow-[0_8px_32px_rgba(37,99,235,0.12)]",
    gradientHover: "from-blue-50/80 to-transparent",
    accentColor: "text-blue-600",
  },
  {
    icon: Activity,
    title: "Monitoreo en Tiempo Real",
    description: "Seguimiento continuo",
    details:
      "Visualización actualizada del alcance territorial, cantidad de personas impactadas y localidades activas. Indicadores en vivo para el seguimiento de la gestión diaria.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderHover: "hover:border-emerald-300",
    shadowHover: "hover:shadow-[0_8px_32px_rgba(16,185,129,0.12)]",
    gradientHover: "from-emerald-50/80 to-transparent",
    accentColor: "text-emerald-600",
  },
  {
    icon: LayoutDashboard,
    title: "Tableros de Control Interno",
    description: "Decisiones basadas en datos",
    details:
      "Dashboards con indicadores clave de desempeño, consolidación de información por programa y territorio, y reportes automáticos para la toma de decisiones estratégicas.",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    borderHover: "hover:border-violet-300",
    shadowHover: "hover:shadow-[0_8px_32px_rgba(109,40,217,0.12)]",
    gradientHover: "from-violet-50/80 to-transparent",
    accentColor: "text-violet-600",
  },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 0.8 },
  },
}

export function EcosystemSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-50 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="section-divider mb-6" />

          <div className="inline-block mb-4">
            <span className="badge-accent">Sistema Integrado</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Soluciones Integradas
            <span className="block text-gradient">para la Gestión Interna</span>
          </h2>

          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Módulos interconectados que centralizan el registro, el monitoreo y el análisis
            de resultados de la Secretaría de Participación Ciudadana.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <motion.div key={module.title} variants={cardVariant} className="group">
                <Card
                  className={`h-full overflow-hidden border border-slate-200 bg-white
                    shadow-sm transition-all duration-300 hover:-translate-y-1.5
                    ${module.borderHover} ${module.shadowHover}`}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${module.gradientHover}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />

                  <div className="spotlight-glow" />

                  <CardHeader className="pb-3 relative z-10">
                    <motion.div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${module.iconBg} mb-4 border border-white shadow-sm transition-all group-hover:scale-110`}
                      whileHover={{ rotate: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className={`h-7 w-7 ${module.iconColor}`} />
                    </motion.div>

                    <CardTitle className="text-base font-bold text-slate-900">
                      {module.title}
                    </CardTitle>
                    <CardDescription className={`${module.accentColor} font-semibold text-xs uppercase tracking-wide`}>
                      {module.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                      {module.details}
                    </p>
                  </CardContent>

                  {/* Index number */}
                  <div className="absolute bottom-4 right-4 text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors pointer-events-none select-none">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>

                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 text-center max-w-2xl mx-auto shadow-sm"
        >
          <p className="text-slate-700 font-medium">
            Todos los módulos comparten la misma base de datos para garantizar{' '}
            <span className="text-blue-700 font-bold">coherencia, trazabilidad y reportes en tiempo real</span>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
