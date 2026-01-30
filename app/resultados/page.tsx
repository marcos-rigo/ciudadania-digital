"use client"

import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { KPIStatCard } from "@/components/ui/kpi-stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  kpisPublicos,
  datosEvolucion,
  datosPorTematica,
  datosPorTerritorio,
} from "@/lib/mock/data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#1e3a5f", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6", "#22c55e", "#84cc16", "#eab308"]

export default function ResultadosPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Resultados e Indicadores"
          description="Datos de impacto y alcance de los programas de participación ciudadana. Transparencia y rendición de cuentas."
          breadcrumbs={[{ label: "Resultados" }]}
        />

        {/* KPIs */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpisPublicos.map((kpi) => (
            <KPIStatCard
              key={kpi.id}
              titulo={kpi.titulo}
              valor={kpi.valor}
              descripcion={kpi.descripcion}
              icono={kpi.icono}
            />
          ))}
        </div>

        {/* Texto institucional */}
        <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Compromiso con la Transparencia
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            La Secretaría de Estado de Participación Ciudadana se compromete con la 
            transparencia y la rendición de cuentas. Los datos presentados en esta 
            sección reflejan el trabajo realizado en el territorio provincial, 
            permitiendo a la ciudadanía conocer el alcance e impacto de las políticas 
            públicas de prevención y participación comunitaria.
          </p>
        </div>

        {/* Charts */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Evolución mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Evolución Mensual de Actividades</CardTitle>
              <CardDescription>
                Cantidad de actividades realizadas por mes durante 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosEvolucion}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="mes"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actividades"
                      stroke="#1e3a5f"
                      strokeWidth={2}
                      dot={{ fill: "#1e3a5f", strokeWidth: 2 }}
                      name="Actividades"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Asistentes por mes */}
          <Card>
            <CardHeader>
              <CardTitle>Personas Alcanzadas por Mes</CardTitle>
              <CardDescription>
                Total de asistentes a actividades durante 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosEvolucion}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="mes"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="asistentes"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Asistentes"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Por temática */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Temática</CardTitle>
              <CardDescription>
                Cantidad de actividades según temática principal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosPorTematica} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="nombre"
                      type="category"
                      tick={{ fontSize: 11 }}
                      width={150}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="valor"
                      fill="#0ea5e9"
                      radius={[0, 4, 4, 0]}
                      name="Actividades"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Por territorio */}
          <Card>
            <CardHeader>
              <CardTitle>Cobertura Territorial</CardTitle>
              <CardDescription>
                Actividades realizadas por municipio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosPorTerritorio.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nombre, percent }) =>
                        `${nombre.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {datosPorTerritorio.slice(0, 6).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}
