"use client"

import Link from "next/link"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PageHeader } from "@/components/ui/page-header"
import { KPIStatCard } from "@/components/ui/kpi-stat-card"
import { AlertCard } from "@/components/ui/alert-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { kpisInternos, alertas, acciones, datosPorTerritorio } from "@/lib/mock/data"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"

export default function DashboardPage() {
  const ultimasAcciones = acciones.slice(0, 5)

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="Vista general de la gestión de programas y acciones."
      />

      {/* KPIs */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpisInternos.map((kpi) => (
          <KPIStatCard
            key={kpi.id}
            titulo={kpi.titulo}
            valor={kpi.valor}
            descripcion={kpi.descripcion}
            variacion={kpi.variacion}
            icono={kpi.icono}
          />
        ))}
      </div>

      {/* Alerts and Map */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alertas y Novedades</CardTitle>
              <CardDescription>Eventos que requieren atención</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertas.map((alerta) => (
                <AlertCard key={alerta.id} alerta={alerta} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Map Mock */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Cobertura Territorial</CardTitle>
              <CardDescription>
                Distribución de actividades por municipio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Map placeholder */}
                <div className="aspect-square bg-muted/50 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Mapa de Tucumán
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      (Placeholder para integración de mapa)
                    </p>
                  </div>
                </div>

                {/* Territory list */}
                <div className="space-y-2">
                  {datosPorTerritorio.slice(0, 6).map((territorio) => (
                    <div
                      key={territorio.nombre}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium">
                          {territorio.nombre}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {territorio.valor} acciones
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Actions Table */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Últimas Actividades Cargadas</CardTitle>
                <CardDescription>Acciones más recientes del equipo</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/equipo/acciones">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground text-sm">
                      Fecha
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground text-sm">
                      Municipio
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground text-sm">
                      Programa
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground text-sm">
                      Temática
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground text-sm text-right">
                      Asistentes
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground text-sm">
                      Modalidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasAcciones.map((accion) => (
                    <tr key={accion.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">
                        {new Date(accion.fecha).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{accion.municipio}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {accion.programaNombre}
                      </td>
                      <td className="py-3 text-sm">{accion.tematicaPrincipal}</td>
                      <td className="py-3 text-sm text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {accion.cantidadAsistentes}
                        </div>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={accion.modalidad} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
