import { notFound } from "next/navigation"
import Link from "next/link"
import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { TagChips } from "@/components/ui/tag-chips"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { programas, acciones } from "@/lib/mock/data"
import {
  Target,
  Users,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

interface ProgramaPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProgramaPage({ params }: ProgramaPageProps) {
  const { slug } = await params
  const programa = programas.find((p) => p.slug === slug)

  if (!programa) {
    notFound()
  }

  const accionesPrograma = acciones.filter((a) => a.programaId === programa.id)
  const totalAsistentes = accionesPrograma.reduce(
    (sum, a) => sum + a.cantidadAsistentes,
    0
  )

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={programa.nombre}
          description={programa.descripcion}
          breadcrumbs={[
            { label: "Programas", href: "/programas" },
            { label: programa.nombre },
          ]}
          actions={<StatusBadge status={programa.estado} />}
        />

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {programa.objetivos.map((objetivo, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Últimas acciones */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Últimas Acciones
                  </CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/acciones?programa=${programa.id}`}>
                      Ver todas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {accionesPrograma.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay acciones registradas aún.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {accionesPrograma.slice(0, 3).map((accion) => (
                      <div
                        key={accion.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 dark:bg-muted/30"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-foreground">
                              {accion.municipio}
                            </span>
                            <StatusBadge status={accion.modalidad} />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {accion.tematicaPrincipal} •{" "}
                            {new Date(accion.fecha).toLocaleDateString("es-AR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {accion.cantidadAsistentes} asistentes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50 dark:bg-muted/30">
                    <p className="text-2xl font-bold text-foreground">
                      {accionesPrograma.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Acciones</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50 dark:bg-muted/30">
                    <p className="text-2xl font-bold text-foreground">
                      {totalAsistentes.toLocaleString("es-AR")}
                    </p>
                    <p className="text-sm text-muted-foreground">Asistentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Públicos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Público Objetivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TagChips tags={programa.publicos} variant="secondary" size="md" />
              </CardContent>
            </Card>

            {/* Territorios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Territorios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {programa.territorios.map((territorio) => (
                    <li
                      key={territorio}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {territorio}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Temáticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Temáticas</CardTitle>
              </CardHeader>
              <CardContent>
                <TagChips tags={programa.tematicas} variant="primary" size="md" />
              </CardContent>
            </Card>

            {/* Responsables */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Responsables</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {programa.responsables.map((responsable) => (
                    <li
                      key={responsable}
                      className="text-sm text-muted-foreground"
                    >
                      {responsable}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
