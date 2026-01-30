import {
  GraduationCap,
  Clock,
  Compass,
  TrendingUp,
  Users,
  ShieldCheck,
  BarChart3,
  Clipboard,
  MessageCircle,
} from "lucide-react"

const benefits = [
  {
    icon: GraduationCap,
    title: "Aprender a habitar el mundo digital",
    description:
      "Contenidos y trayectos formativos que ayudan a comprender cómo funcionan los entornos digitales y cómo participar en ellos de manera consciente.",
  },
  {
    icon: ShieldCheck,
    title: "Cuidarse y cuidar a otros en línea",
    description:
      "Herramientas para reconocer riesgos, ejercer derechos y promover vínculos respetuosos y seguros en el uso cotidiano de la tecnología.",
  },
  {
    icon: Compass,
    title: "Orientación clara y accesible",
    description:
      "Recorridos de aprendizaje organizados por temas que permiten avanzar paso a paso, sin conocimientos previos y a tu propio ritmo.",
  },
  {
    icon: MessageCircle,
    title: "Participar con información y criterio",
    description:
      "Espacios de reflexión que fortalecen la opinión informada, el diálogo y la convivencia digital en comunidades diversas.",
  },
  {
    icon: Users,
    title: "Sentirse parte de una comunidad",
    description:
      "Un espacio compartido para aprender junto a otros, reconocer experiencias comunes y construir ciudadanía también en lo digital.",
  },
  {
    icon: TrendingUp,
    title: "Desarrollar habilidades para el presente y el futuro",
    description:
      "Aprendizajes aplicables a la vida cotidiana que fortalecen la autonomía, la responsabilidad y la participación en la sociedad digital.",
  },
]


export function BenefitsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Beneficios para la Ciudadanía
          </h2>
          <p className="text-lg text-muted-foreground">
            Una plataforma diseñada para potenciar las habilidades digitales de las personas y
            fomentar la participación activa.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="group relative p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
