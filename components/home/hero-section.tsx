import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LogIn } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Network lines decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 right-0 w-1/2 h-full opacity-5"
          viewBox="0 0 400 600"
          fill="none"
        >
          <path
            d="M100 100 L300 150 L200 300 L350 400 L150 500"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary"
          />
          <path
            d="M50 200 L250 180 L150 350 L300 450"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary"
          />
          <circle cx="100" cy="100" r="4" fill="currentColor" className="text-primary" />
          <circle cx="300" cy="150" r="4" fill="currentColor" className="text-primary" />
          <circle cx="200" cy="300" r="4" fill="currentColor" className="text-primary" />
          <circle cx="350" cy="400" r="4" fill="currentColor" className="text-primary" />
          <circle cx="150" cy="500" r="4" fill="currentColor" className="text-primary" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center py-20 lg:py-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Plataforma Digital Operativa de Tucumán 
          </div>

          

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight max-w-4xl text-balance">
            Plataforma de Gestión para una Ciudadanía Activa y Participativa
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl text-pretty">
            Hacia una gestión inteligente: datos, territorio y participación ciudadana. <br />
            Dr. José Farhat - Secretario de Estado de Participación Ciudadana
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-base">
              <Link href="/programas">
                Ver Programas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
              <Link href="/equipo/login">
                <LogIn className="mr-2 h-5 w-5" />
                Ingresar (Equipo)
              </Link>
            </Button>
          </div>

          {/* Stats preview */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            {[
              { value: "106", label: "Actividades" },
              { value: "17", label: "Municipios y Comunas" },
              { value: "9033", label: "Personas alcanzadas" },
              { value: "4", label: "Programas activos" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
