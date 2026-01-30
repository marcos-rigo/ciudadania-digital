import { Lightbulb, CheckCircle2 } from "lucide-react"

export function ChallengeSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* La Oportunidad */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-sm font-medium">
              <Lightbulb className="h-4 w-4" />
              La Oportunidad
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Una nueva forma de formarse como ciudadano digital
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              La vida digital atraviesa nuestras relaciones, decisiones y formas de participación. Frente a este escenario, proponemos un espacio abierto de formación, reflexión y aprendizaje continuo.
              <br /> Este portal reúne contenidos, experiencias y trayectos formativos pensados para:
            </p>
            <ul className="space-y-3">
              {[
                "Comprender el territorio digital",
                "Ejercer derechos y responsabilidades",
                "Participar de manera informada y segura",
                "Un espacio para aprender hoy, y construir ciudadanía para el futuro",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* La Experiencia */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-700 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              La Experiencia
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Aprender, reflexionar y participar en un mismo lugar
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Este portal fue diseñado como un espacio amigable y accesible, donde cada persona puede aprender haciendo, 
              escuchar distintas miradas y construir una postura crítica sobre el mundo digital.
            </p>
            <ul className="space-y-3">
              {[
                "Videos, podcast y materiales interactivos",
                "Actividades de autoevaluación y devolución",
                "Seguimiento del progreso personal",
                "Un aprendizaje cercano, claro y significativo",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
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
