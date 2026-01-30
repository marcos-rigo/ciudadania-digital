import { GraduationCap, Users, Clipboard, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"



const modules = [
  {
    icon: GraduationCap,
    title: "Ciudadanía Digital",
    description: "Formación y trayectos",
    details:
      "Espacio de formación abierta en ciudadanía digital. Trayectos con videos, podcast y actividades que promueven el uso responsable, crítico y participativo de las tecnologías.",
    color: "bg-blue-500",
  },
  {
    icon: Users,
    title: "Participación y Comunidad",
    description: "Aprender en red",
    details:
      "Entorno digital que fomenta la participación ciudadana, el intercambio de experiencias y la reflexión colectiva sobre la convivencia y los desafíos del mundo digital.",
    color: "bg-emerald-500",
  },
  {
    icon: Clipboard,
    title: "Registro y Seguimiento",
    description: "Trazabilidad de acciones",
    details:
      "Sistema interno para registrar actividades, capacitaciones y acciones territoriales. Permite el seguimiento del alcance, la planificación y la evaluación de impacto.",
    color: "bg-amber-500",
  },
  {
    icon: BarChart3,
    title: "Análisis y Gestión",
    description: "Datos para decidir",
    details:
      "Tableros e indicadores que consolidan información de participación, formación y territorio. Herramientas para mejorar la toma de decisiones y los informes de gestión.",
    color: "bg-rose-500",
  },
]


export function EcosystemSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ecosistema Digital Integrado
          </h2>
          <p className="text-lg text-muted-foreground">
            Módulos interconectados que trabajan juntos para potenciar 
            la participación ciudadana.
          </p>
        </div>

        {/* Ecosystem Diagram */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection lines (visible on lg+) */}
          <div className="hidden lg:block absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
              {/* Horizontal line */}
              <path
                d="M200 200 L600 200"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 4"
                className="text-border"
              />
              {/* Vertical line */}
              <path
                d="M400 100 L400 300"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 4"
                className="text-border"
              />
              {/* Center circle */}
              <circle
                cx="400"
                cy="200"
                r="40"
                fill="currentColor"
                className="text-primary/10"
              />
              <text
                x="400"
                y="195"
                textAnchor="middle"
                className="fill-primary text-xs font-medium"
              >
                SPC
              </text>
              <text
                x="400"
                y="210"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                Integrado
              </text>
            </svg>
          </div>

          {/* Module Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <Card
                  key={module.title}
                  className="relative overflow-hidden border-border/50 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${module.color} mb-3`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {module.details}
                    </p>
                  </CardContent>
                  {/* Decorative number */}
                  <div className="absolute -bottom-4 -right-2 text-8xl font-bold text-muted/20">
                    {index + 1}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
