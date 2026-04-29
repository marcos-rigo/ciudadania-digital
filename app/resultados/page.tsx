"use client"

import { useEffect, useState } from "react"
import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { KPIStatCard } from "@/components/ui/kpi-stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sbGetActividades } from "@/lib/supabase-client"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts"

type Año = "2025" | "2026" | "total"

interface Actividad {
  fecha: string
  programa: string
  localidad: string
  cantidad_personas: number
}

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
const COLORS = ["#1e3a5f","#3b82f6","#0ea5e9","#06b6d4","#14b8a6","#22c55e","#84cc16","#eab308"]

const FILTRO_FECHA: Record<Año, string> = {
  "2025": "&fecha=gte.2025-01-01&fecha=lt.2026-01-01",
  "2026": "&fecha=gte.2026-01-01&fecha=lt.2027-01-01",
  "total": "",
}

function agruparPorMes(actividades: Actividad[]) {
  const porMes = Array.from({ length: 12 }, () => ({ actividades: 0, asistentes: 0 }))
  for (const a of actividades) {
    const mes = parseInt(a.fecha?.slice(5, 7) ?? "0") - 1
    if (mes >= 0 && mes < 12) {
      porMes[mes].actividades++
      porMes[mes].asistentes += a.cantidad_personas || 0
    }
  }
  return MESES.map((mes, i) => ({ mes, ...porMes[i] }))
}

function agruparPorCampo(actividades: Actividad[], campo: keyof Actividad) {
  const conteo: Record<string, number> = {}
  for (const a of actividades) {
    const clave = String(a[campo] || "Sin datos")
    conteo[clave] = (conteo[clave] || 0) + 1
  }
  return Object.entries(conteo)
    .map(([nombre, valor]) => ({ nombre, valor }))
    .sort((a, b) => b.valor - a.valor)
}

export default function ResultadosPage() {
  const [año, setAño] = useState<Año>("2025")
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const f = FILTRO_FECHA[año]
    sbGetActividades(`select=fecha,programa,localidad,cantidad_personas${f}`)
      .then(data => {
        setActividades(data as Actividad[])
      })
      .catch(err => {
        console.error('Error cargando actividades:', err)
        setError(String(err?.message ?? err))
        setActividades([])
      })
      .finally(() => setLoading(false))
  }, [año])

  const totalActividades = actividades.length
  const totalPersonas = actividades.reduce((s, a) => s + (a.cantidad_personas || 0), 0)
  const municipiosUnicos = new Set(actividades.map(a => a.localidad).filter(Boolean)).size
  const promedio = totalActividades > 0 ? Math.round(totalPersonas / totalActividades) : 0

  const evolucion = agruparPorMes(actividades)
  const porPrograma = agruparPorCampo(actividades, "programa")
  const porLocalidad = agruparPorCampo(actividades, "localidad")

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">

        {/* Header + selector año */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <PageHeader
            title="Resultados e Indicadores"
            description="Datos reales de impacto y alcance de los programas de participación ciudadana."
            breadcrumbs={[{ label: "Resultados" }]}
          />
          <div className="flex items-center bg-muted rounded-xl p-1 gap-1 self-start sm:mt-2 shrink-0">
            {(["2025", "2026", "total"] as Año[]).map((a) => (
              <button
                key={a}
                onClick={() => setAño(a)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  año === a
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {a === "total" ? "Total" : a}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="mt-12 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <strong>Error al cargar datos:</strong> {error}
          </div>
        ) : totalActividades === 0 ? (
          <p className="mt-20 text-center text-muted-foreground italic">
            {año === "2026"
              ? "Aún no hay actividades registradas para 2026."
              : "No hay actividades para el período seleccionado."}
          </p>
        ) : (
          <>
            {/* KPIs */}
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { titulo: "Actividades Realizadas",  valor: totalActividades,  descripcion: "Acciones registradas en el período",           icono: "calendar"     },
                { titulo: "Municipios Alcanzados",   valor: municipiosUnicos,  descripcion: "Municipios o comunas con actividad",            icono: "map-pin"      },
                { titulo: "Personas Alcanzadas",     valor: totalPersonas,     descripcion: "Participantes directos en actividades",         icono: "users"        },
                { titulo: "Promedio por Actividad",  valor: promedio,          descripcion: "Personas promedio por cada evento realizado",   icono: "trending-up"  },
              ].map((kpi) => (
                <KPIStatCard
                  key={kpi.titulo}
                  titulo={kpi.titulo}
                  valor={kpi.valor}
                  descripcion={kpi.descripcion}
                  icono={kpi.icono}
                />
              ))}
            </div>

            {/* Gráficos */}
            <div className="mt-12 grid lg:grid-cols-2 gap-8">

              {/* Evolución mensual — actividades */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolución Mensual de Actividades</CardTitle>
                  <CardDescription>
                    Actividades realizadas por mes · {año === "total" ? "todos los años" : año}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={evolucion}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="mes" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                        <Line type="monotone" dataKey="actividades" stroke="#1e3a5f" strokeWidth={2} dot={{ fill: "#1e3a5f", strokeWidth: 2 }} name="Actividades" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Evolución mensual — personas */}
              <Card>
                <CardHeader>
                  <CardTitle>Personas Alcanzadas por Mes</CardTitle>
                  <CardDescription>
                    Total de asistentes por mes · {año === "total" ? "todos los años" : año}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={evolucion}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="mes" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                        <Bar dataKey="asistentes" fill="#3b82f6" radius={[4,4,0,0]} name="Asistentes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Por programa */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Programa</CardTitle>
                  <CardDescription>Cantidad de actividades por campaña o proyecto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={porPrograma} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11 }} width={165} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                        <Bar dataKey="valor" fill="#0ea5e9" radius={[0,4,4,0]} name="Actividades" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cobertura territorial */}
              <Card>
                <CardHeader>
                  <CardTitle>Cobertura Territorial</CardTitle>
                  <CardDescription>Actividades por municipio o comuna (top 6)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={porLocalidad.slice(0, 6)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ nombre, percent }) =>
                            `${nombre.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          dataKey="valor"
                        >
                          {porLocalidad.slice(0, 6).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Texto institucional */}
            <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/10">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Compromiso con la Transparencia
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                La Secretaría de Estado de Participación Ciudadana se compromete con la
                transparencia y la rendición de cuentas. Los datos presentados reflejan
                el trabajo realizado en el territorio provincial, permitiendo a la ciudadanía
                conocer el alcance e impacto de las políticas públicas de prevención y
                participación comunitaria.
              </p>
            </div>
          </>
        )}

      </div>
    </PublicLayout>
  )
}
