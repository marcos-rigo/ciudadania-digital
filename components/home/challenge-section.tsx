import { Lightbulb, CheckCircle2 } from "lucide-react"

const leftItems = [
  "Comprender el territorio digital",
  "Ejercer derechos y responsabilidades",
  "Participar de manera informada y segura",
  "Un espacio para aprender hoy, y construir ciudadanía para el futuro",
]

const rightItems = [
  "Videos, podcast y materiales interactivos",
  "Actividades de autoevaluación y devolución",
  "Seguimiento del progreso personal",
  "Un aprendizaje cercano, claro y significativo",
]

export function ChallengeSection() {
  return (
    <section className="py-24 bg-content-subtle relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-divider mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4">
            Una plataforma diseñada para vos
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Formación, participación y herramientas de gestión en un solo lugar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* La Oportunidad */}
          <div className="bg-white rounded-2xl border border-slate-200/80 card-glow p-8 hover:border-blue-200 transition-all duration-300 group">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold mb-6">
              <Lightbulb className="h-4 w-4" />
              La Oportunidad
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
              Una nueva forma de formarse como ciudadano digital
            </h3>
            <p className="text-slate-500 leading-relaxed mb-6 text-sm">
              La vida digital atraviesa nuestras relaciones, decisiones y formas de participación.
              Este portal reúne contenidos, experiencias y trayectos formativos pensados para:
            </p>
            <ul className="space-y-3">
              {leftItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-600 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* La Experiencia */}
          <div className="bg-white rounded-2xl border border-slate-200/80 card-glow p-8 hover:border-violet-200 transition-all duration-300 group">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold mb-6">
              <CheckCircle2 className="h-4 w-4" />
              La Experiencia
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
              Aprender, reflexionar y participar en un mismo lugar
            </h3>
            <p className="text-slate-500 leading-relaxed mb-6 text-sm">
              Este portal fue diseñado como un espacio amigable y accesible, donde cada persona
              puede aprender haciendo y construir una postura crítica sobre el mundo digital.
            </p>
            <ul className="space-y-3">
              {rightItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
