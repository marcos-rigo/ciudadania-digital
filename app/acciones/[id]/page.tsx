import { notFound } from "next/navigation"
import Link from "next/link"
import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { TagChips } from "@/components/ui/tag-chips"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { acciones } from "@/lib/mock/data"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  FolderOpen,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"

interface AccionPageProps {
  params: Promise<{ id: string }>
}

export default async function AccionPage({ params }: AccionPageProps) {
  const { id } = await params
  const accion = acciones.find((a) => a.id === id)

  if (!accion) {
    notFound()
  }

  const allTematicas = [
    accion.tematicaPrincipal,
    ...(accion.tematicasSecundarias || []),
  ]

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={`${accion.municipio}${accion.localidad ? ` - ${accion.localidad}` : ""}`}
          description={accion.descripcion || "Actividad realizada en el marco de programas de participación ciudadana."}
          breadcrumbs={[
            { label: "Acciones", href: "/acciones" },
            { label: accion.municipio },
          ]}
          actions={
            <Button asChild variant="outline">
              <Link href="/acciones">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
          }
        />

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles principales */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Actividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha</p>
                      <p className="font-medium">
                        {new Date(accion.fecha).toLocaleDateString("es-AR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ubicación</p>
                      <p className="font-medium">{accion.municipio}</p>
                      {accion.localidad && (
                        <p className="text-sm text-muted-foreground">
                          {accion.localidad}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Asistentes</p>
                      <p className="font-medium">{accion.cantidadAsistentes} personas</p>
                      <p className="text-sm text-muted-foreground">{accion.publico}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duración</p>
                      <p className="font-medium">{accion.duracionMinutos} minutos</p>
                      <StatusBadge status={accion.modalidad} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Devoluciones */}
            {accion.devoluciones && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Devoluciones y Aportes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                    <p className="text-muted-foreground italic">
                      "{accion.devoluciones}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Programa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  Programa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/programas/${acciones.find((a) => a.id === accion.programaId)?.programaId || "#"}`}
                  className="font-medium text-primary hover:underline"
                >
                  {accion.programaNombre}
                </Link>
              </CardContent>
            </Card>

            {/* Temáticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Temáticas</CardTitle>
              </CardHeader>
              <CardContent>
                <TagChips tags={allTematicas} variant="primary" size="md" />
              </CardContent>
            </Card>

            {/* Indicadores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Indicadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Asistentes</span>
                    <span className="font-semibold">{accion.cantidadAsistentes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duración</span>
                    <span className="font-semibold">{accion.duracionMinutos} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Horas/persona</span>
                    <span className="font-semibold">
                      {((accion.cantidadAsistentes * accion.duracionMinutos) / 60).toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
