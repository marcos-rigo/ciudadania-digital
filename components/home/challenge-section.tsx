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
    <section className="py-24 bg-[#050810] relative overflow-hidden">
      {/* Grid & Glows */}
      <div className="bg-grid opacity-20" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-divider mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mt-4">
            Una plataforma diseñada para vos
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Formación, participación y herramientas de gestión en un solo lugar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* La Oportunidad */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 card-glow p-8 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Lightbulb className="h-4 w-4" />
              La Oportunidad
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3 leading-tight">
              Una nueva forma de formarse como ciudadano digital
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm">
              La vida digital atraviesa nuestras relaciones, decisiones y formas de participación.
              Este portal reúne contenidos, experiencias y trayectos formativos pensados para:
            </p>
            <ul className="space-y-3">
              {leftItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* La Experiencia */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 card-glow p-8 hover:border-violet-500/30 transition-all duration-300 group">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-semibold mb-6 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4" />
              La Experiencia
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3 leading-tight">
              Aprender, reflexionar y participar en un mismo lugar
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm">
              Este portal fue diseñado como un espacio amigable y accesible, donde cada persona
              puede aprender haciendo y construir una postura crítica sobre el mundo digital.
            </p>
            <ul className="space-y-3">
              {rightItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
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