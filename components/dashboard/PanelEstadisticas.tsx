'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { sbGetActividades } from '@/lib/supabase-client'
import { BarChart2, Search, X } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import { PowerBIEmbed } from './PowerBIEmbed'
import type { AnioFilter } from '@/types/powerbi'

interface Actividad {
  fecha: string
  programa: string
  localidad: string
  cantidad_personas: number
  usuario_nombre: string
}

const FILTRO_FECHA: Record<string, string> = {
  '2025': '&fecha=gte.2025-01-01&fecha=lt.2026-01-01',
  '2026': '&fecha=gte.2026-01-01&fecha=lt.2027-01-01',
}

const POR_PAGINA = 10

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const CHART_COLORS = ['#1e3d8f','#2b54c2','#4a72d8','#0ea5e9','#06b6d4','#14b8a6','#22c55e','#84cc16']

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '12px',
}

function formatFecha(f: string) {
  if (!f) return '-'
  return new Date(f + 'T00:00:00').toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function agruparPorMes(actividades: Actividad[]) {
  const porMes = Array.from({ length: 12 }, () => ({ actividades: 0, asistentes: 0 }))
  for (const a of actividades) {
    const mes = parseInt(a.fecha?.slice(5, 7) ?? '0') - 1
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
    const clave = String(a[campo] || 'Sin datos')
    conteo[clave] = (conteo[clave] || 0) + 1
  }
  return Object.entries(conteo)
    .map(([nombre, valor]) => ({ nombre, valor }))
    .sort((a, b) => b.valor - a.valor)
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-glow bg-white border border-slate-100 rounded-2xl p-5 text-center">
      <div className="metric-value text-3xl font-black leading-none">{value}</div>
      <div className="text-xs text-slate-400 mt-2 font-medium tracking-wide">{label}</div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="card-glow bg-white border border-slate-200/80 rounded-2xl p-6">
      <h3 className="font-bold text-slate-900 mb-0.5 text-sm">{title}</h3>
      <p className="text-xs text-slate-400 mb-5">{subtitle}</p>
      <div className="h-[260px]">{children}</div>
    </div>
  )
}

export function PanelEstadisticas({ rol }: { rol: string }) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  const anioParam = searchParams.get('anio')
  const anio: AnioFilter = anioParam === '2026' ? '2026' : '2025'

  function handleAnioChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === '2025') params.delete('anio')
    else params.set('anio', value)
    const qs = params.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  // ── Data ──────────────────────────────────────────────────
  const [data, setData]       = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  // ── Filtros ───────────────────────────────────────────────
  const [search, setSearch]             = useState('')
  const [filPrograma, setFilPrograma]   = useState('all')
  const [filLocalidad, setFilLocalidad] = useState('all')
  const [pagina, setPagina]             = useState(1)

  useEffect(() => {
    if (anio !== '2025') return
    setLoading(true)
    setError(false)
    setSearch('')
    setFilPrograma('all')
    setFilLocalidad('all')
    setPagina(1)

    sbGetActividades(
      `select=fecha,programa,localidad,cantidad_personas,usuario_nombre&order=fecha.desc${FILTRO_FECHA['2025']}`
    )
      .then((r) => setData(r as Actividad[]))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [anio])

  // ── Opciones dinámicas de filtros ─────────────────────────
  const programasUnicos = useMemo(
    () => [...new Set(data.map((d) => d.programa).filter(Boolean))].sort(),
    [data]
  )
  const localidadesUnicas = useMemo(
    () => [...new Set(data.map((d) => d.localidad).filter(Boolean))].sort(),
    [data]
  )

  // ── Filtrado ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    return data.filter((a) => {
      if (search) {
        const q = search.toLowerCase()
        const match =
          (a.localidad ?? '').toLowerCase().includes(q) ||
          (a.programa  ?? '').toLowerCase().includes(q)
        if (!match) return false
      }
      if (filPrograma  !== 'all' && a.programa  !== filPrograma)  return false
      if (filLocalidad !== 'all' && a.localidad !== filLocalidad) return false
      return true
    })
  }, [data, search, filPrograma, filLocalidad])

  const applySearch    = (v: string) => { setSearch(v);       setPagina(1) }
  const applyPrograma  = (v: string) => { setFilPrograma(v);  setPagina(1) }
  const applyLocalidad = (v: string) => { setFilLocalidad(v); setPagina(1) }
  const hasFilters = !!(search || filPrograma !== 'all' || filLocalidad !== 'all')
  const clearFilters = () => { setSearch(''); setFilPrograma('all'); setFilLocalidad('all'); setPagina(1) }

  // ── Stats (sobre filtered) ────────────────────────────────
  const totalActividades = filtered.length
  const totalPersonas    = filtered.reduce((s, r) => s + (parseInt(String(r.cantidad_personas)) || 0), 0)
  const municipiosUnicos = new Set(filtered.map((a) => a.localidad).filter(Boolean)).size
  const promedio         = totalActividades > 0 ? Math.round(totalPersonas / totalActividades) : 0

  // ── Paginación ────────────────────────────────────────────
  const totalPaginas = Math.ceil(filtered.length / POR_PAGINA)
  const paginated    = filtered.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  // ── Datos para gráficos (sobre data completa, sin filtros) ─
  const evolucion    = useMemo(() => agruparPorMes(data), [data])
  const porPrograma  = useMemo(() => agruparPorCampo(data, 'programa'), [data])
  const porLocalidad = useMemo(() => agruparPorCampo(data, 'localidad'), [data])

  return (
    <Tabs value={anio} onValueChange={handleAnioChange} className="w-full">
      {/* Selector de año */}
      <TabsList className="bg-slate-100/80 p-1 h-auto rounded-xl shadow-none border-0 gap-1">
        <TabsTrigger
          value="2025"
          className="px-5 py-2 rounded-lg text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-500 data-[state=inactive]:bg-transparent border-0 transition-all"
        >
          2025
        </TabsTrigger>
        <TabsTrigger
          value="2026"
          className="px-5 py-2 rounded-lg text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-500 data-[state=inactive]:bg-transparent border-0 transition-all"
        >
          2026
        </TabsTrigger>
      </TabsList>

      {/* ── Tab 2025 ── */}
      <TabsContent value="2025" className="mt-4 animate-in fade-in-0 duration-200 space-y-6">

        {/* Heading */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-8 space-y-6">
          <h2 className="text-slate-800 font-black text-xl flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
              <BarChart2 className="text-white w-4 h-4" />
            </span>
            Actividades · 2025
          </h2>

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <span className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin inline-block" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-8 text-red-600 text-sm">
              Error al cargar los datos. Intentá de nuevo más tarde.
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Stat cards — 4 columnas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard value={totalActividades.toLocaleString('es-AR')} label="Actividades" />
                <StatCard value={totalPersonas.toLocaleString('es-AR')}    label="Personas alcanzadas" />
                <StatCard value={municipiosUnicos.toLocaleString('es-AR')} label="Municipios alcanzados" />
                <StatCard value={promedio.toLocaleString('es-AR')}         label="Promedio por actividad" />
              </div>

              <div className="divider-fade" />

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por programa o localidad..."
                    value={search}
                    onChange={(e) => applySearch(e.target.value)}
                    className="pl-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={filPrograma} onValueChange={applyPrograma}>
                    <SelectTrigger className="w-[200px] border-slate-200 shadow-sm">
                      <SelectValue placeholder="Programa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los programas</SelectItem>
                      {programasUnicos.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filLocalidad} onValueChange={applyLocalidad}>
                    <SelectTrigger className="w-[200px] border-slate-200 shadow-sm">
                      <SelectValue placeholder="Municipio o Comuna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los municipios</SelectItem>
                      {localidadesUnicas.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-9 text-slate-500 hover:text-slate-900"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabla / empty */}
              {filtered.length === 0 ? (
                <p className="text-center text-slate-400 italic py-8 text-sm">
                  {hasFilters
                    ? 'No hay actividades que coincidan con los filtros.'
                    : 'Aún no hay actividades registradas para 2025.'}
                </p>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
                  {/* Resumen barra */}
                  <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-b border-slate-200/70">
                    <span className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{filtered.length}</span> actividades
                    </span>
                    <span className="text-xs text-slate-500">
                      <span className="font-semibold text-blue-700">
                        {totalPersonas.toLocaleString('es-AR')}
                      </span>{' '}
                      personas alcanzadas
                    </span>
                  </div>

                  {/* Desktop: tabla */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50/60">
                          {['Fecha', 'Municipio / Comuna', 'Programa', 'Personas', 'Cargado por'].map((h) => (
                            <th
                              key={h}
                              className="text-left px-5 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-200/70"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((a, i) => (
                          <tr
                            key={i}
                            className="hover:bg-blue-50/25 border-b border-slate-100 last:border-0 transition-colors"
                          >
                            <td className="px-5 py-3 text-slate-600 tabular-nums whitespace-nowrap">
                              {formatFecha(a.fecha)}
                            </td>
                            <td className="px-5 py-3 font-medium text-slate-800">
                              {a.localidad || '-'}
                            </td>
                            <td className="px-5 py-3 text-slate-700">
                              {a.programa || '-'}
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                {(parseInt(String(a.cantidad_personas)) || 0).toLocaleString('es-AR')}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-400 text-xs">
                              {a.usuario_nombre || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: cards */}
                  <div className="sm:hidden divide-y divide-slate-100">
                    {paginated.map((a, i) => (
                      <div key={i} className="px-4 py-4 hover:bg-blue-50/20 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-600 text-sm font-medium tabular-nums">
                            {formatFecha(a.fecha)}
                          </span>
                          <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-100">
                            {(parseInt(String(a.cantidad_personas)) || 0).toLocaleString('es-AR')} personas
                          </span>
                        </div>
                        <p className="text-slate-800 text-sm font-semibold truncate">{a.programa || '-'}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-slate-500 text-xs">{a.localidad || '-'}</span>
                          <span className="text-slate-400 text-xs truncate max-w-[150px]">{a.usuario_nombre || '-'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPaginas > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200/70 bg-slate-50/80">
                      <span className="text-xs text-slate-500">
                        Página{' '}
                        <span className="font-semibold text-slate-700">{pagina}</span> de{' '}
                        <span className="font-semibold text-slate-700">{totalPaginas}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => setPagina(1)}
                          disabled={pagina === 1}
                          className="h-8 w-8 p-0 border-slate-200 text-slate-600 disabled:opacity-40">
                          «
                        </Button>
                        <Button variant="outline" size="sm"
                          onClick={() => setPagina((p) => Math.max(1, p - 1))}
                          disabled={pagina === 1}
                          className="h-8 px-3 border-slate-200 text-slate-600 disabled:opacity-40">
                          Anterior
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                            .filter((n) => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
                            .reduce<(number | '…')[]>((acc, n, idx, arr) => {
                              if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('…')
                              acc.push(n)
                              return acc
                            }, [])
                            .map((n, idx) =>
                              n === '…' ? (
                                <span key={`e${idx}`} className="px-1 text-slate-400 text-sm">…</span>
                              ) : (
                                <Button
                                  key={n}
                                  variant={pagina === n ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setPagina(n as number)}
                                  className={`h-8 w-8 p-0 text-sm ${
                                    pagina === n
                                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                      : 'border-slate-200 text-slate-600 hover:border-blue-300'
                                  }`}
                                >
                                  {n}
                                </Button>
                              )
                            )}
                        </div>

                        <Button variant="outline" size="sm"
                          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                          disabled={pagina === totalPaginas}
                          className="h-8 px-3 border-slate-200 text-slate-600 disabled:opacity-40">
                          Siguiente
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setPagina(totalPaginas)}
                          disabled={pagina === totalPaginas}
                          className="h-8 w-8 p-0 border-slate-200 text-slate-600 disabled:opacity-40">
                          »
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Gráficos (visibles solo cuando hay datos) ── */}
        {!loading && !error && data.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">

            <ChartCard title="Evolución Mensual de Actividades" subtitle="Actividades realizadas por mes · 2025">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="actividades" stroke="#1e3d8f" strokeWidth={2.5}
                    dot={{ fill: '#1e3d8f', strokeWidth: 2, r: 3 }} name="Actividades" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Personas Alcanzadas por Mes" subtitle="Total de participantes por mes · 2025">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolucion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="asistentes" fill="#2b54c2" radius={[4,4,0,0]} name="Asistentes" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Distribución por Programa" subtitle="Cantidad de actividades por campaña o proyecto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porPrograma} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                  <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10 }} width={155} stroke="#cbd5e1" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="valor" fill="#0ea5e9" radius={[0,4,4,0]} name="Actividades" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Cobertura Territorial" subtitle="Actividades por municipio o comuna (top 6)">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={porLocalidad.slice(0, 6)}
                    cx="50%" cy="50%"
                    labelLine={false}
                    label={({ nombre, percent }) =>
                      `${nombre.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={95}
                    dataKey="valor"
                  >
                    {porLocalidad.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        )}

      </TabsContent>

      {/* ── Tab 2026: Power BI embed ── */}
      <TabsContent value="2026" className="mt-4 animate-in fade-in-0 duration-200">
        <PowerBIEmbed />
      </TabsContent>
    </Tabs>
  )
}
