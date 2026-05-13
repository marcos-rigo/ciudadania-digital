'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { sbGetActividades, sbGetActividades2026 } from '@/lib/supabase-client'
import {
  calcularKPIs, agruparPorMes, calcularPersonasPorMes,
  agruparPorPrograma, agruparPorLocalidad, agruparPorTematica,
} from '@/lib/estadisticas-utils'
import { motion } from 'framer-motion'
import {
  BarChart2, Search, X, RefreshCw, Calendar, Users, MapPin, TrendingUp, ExternalLink,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'
import Image from 'next/image'
import type { AnioFilter } from '@/types/powerbi'

interface Actividad {
  fecha: string
  programa: string
  localidad: string
  cantidad_personas: number
  usuario_nombre: string
}

interface Actividad2026 {
  id?: string
  fecha: string
  programa: string
  localidad: string
  cantidad_personas: number
  usuario_nombre: string
  estrategia?: string
  institucion?: string
  direccion?: string
  duracion?: string
  grupo_etario?: string
  tematica?: string
  descripcion?: string
  created_at?: string
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

const staggerCards = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const fadeUpCard = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 14, mass: 0.7 },
  },
}

function formatFecha(f: string) {
  if (!f) return '-'
  return new Date(f + 'T00:00:00').toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function agruparPorMesLocal(actividades: Actividad[]) {
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

function KPICard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="card-glow bg-white border border-slate-100 rounded-2xl p-5 text-center">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <div className="metric-value text-3xl font-black leading-none">{value}</div>
      <div className="text-xs text-slate-400 mt-2 font-medium tracking-wide">{label}</div>
    </div>
  )
}

function ChartCard({
  title, subtitle, children, height = 260,
}: {
  title: string; subtitle: string; children: React.ReactNode; height?: number
}) {
  return (
    <div className="card-glow bg-white border border-slate-200/80 rounded-2xl p-6">
      <h3 className="font-bold text-slate-900 mb-0.5 text-sm">{title}</h3>
      <p className="text-xs text-slate-400 mb-5">{subtitle}</p>
      <div style={{ height: `${height}px` }}>{children}</div>
    </div>
  )
}

export function PanelEstadisticas({ rol }: { rol: string }) {
  const router       = useRouter()
  const pathname     = usePathname()
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

  // ── Data 2025 ─────────────────────────────────────────────
  const [data, setData]       = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  // ── Filtros 2025 ──────────────────────────────────────────
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

  // ── Opciones dinámicas de filtros 2025 ────────────────────
  const programasUnicos = useMemo(
    () => [...new Set(data.map((d) => d.programa).filter(Boolean))].sort(),
    [data]
  )
  const localidadesUnicas = useMemo(
    () => [...new Set(data.map((d) => d.localidad).filter(Boolean))].sort(),
    [data]
  )

  // ── Filtrado 2025 ─────────────────────────────────────────
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

  // ── Stats 2025 (sobre filtered) ───────────────────────────
  const totalActividades = filtered.length
  const totalPersonas    = filtered.reduce((s, r) => s + (parseInt(String(r.cantidad_personas)) || 0), 0)
  const municipiosUnicos = new Set(filtered.map((a) => a.localidad).filter(Boolean)).size
  const promedio         = totalActividades > 0 ? Math.round(totalPersonas / totalActividades) : 0

  // ── Paginación 2025 ───────────────────────────────────────
  const totalPaginas = Math.ceil(filtered.length / POR_PAGINA)
  const paginated    = filtered.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  // ── Gráficos 2025 (sobre data completa) ───────────────────
  const evolucion    = useMemo(() => agruparPorMesLocal(data), [data])
  const porPrograma  = useMemo(() => agruparPorCampo(data, 'programa'), [data])
  const porLocalidad = useMemo(() => agruparPorCampo(data, 'localidad'), [data])

  // ── Data 2026 ─────────────────────────────────────────────
  const [data2026, setData2026]             = useState<Actividad2026[]>([])
  const [loading2026, setLoading2026]       = useState(false)
  const [error2026, setError2026]           = useState(false)
  const [hasFetched2026, setHasFetched2026] = useState(false)

  // ── Filtros 2026 ──────────────────────────────────────────
  const [search2026, setSearch2026]             = useState('')
  const [filPrograma2026, setFilPrograma2026]   = useState('all')
  const [filLocalidad2026, setFilLocalidad2026] = useState('all')
  const [pagina2026, setPagina2026]             = useState(1)

  const fetchData2026 = useCallback(() => {
    setLoading2026(true)
    setError2026(false)
    setSearch2026('')
    setFilPrograma2026('all')
    setFilLocalidad2026('all')
    setPagina2026(1)
    sbGetActividades2026()
      .then((r) => { setData2026(r as Actividad2026[]); setHasFetched2026(true) })
      .catch(() => setError2026(true))
      .finally(() => setLoading2026(false))
  }, [])

  useEffect(() => {
    if (anio !== '2026') return
    if (hasFetched2026) return
    fetchData2026()
  }, [anio, hasFetched2026, fetchData2026])

  // ── Opciones dinámicas de filtros 2026 ────────────────────
  const programasUnicos2026 = useMemo(
    () => [...new Set(data2026.map((d) => d.programa).filter(Boolean))].sort(),
    [data2026]
  )
  const localidadesUnicas2026 = useMemo(
    () => [...new Set(data2026.map((d) => d.localidad).filter(Boolean))].sort(),
    [data2026]
  )

  // ── Filtrado 2026 ─────────────────────────────────────────
  const filtered2026 = useMemo(() => {
    return data2026.filter((a) => {
      if (search2026) {
        const q = search2026.toLowerCase()
        if (
          !(a.localidad ?? '').toLowerCase().includes(q) &&
          !(a.programa  ?? '').toLowerCase().includes(q)
        ) return false
      }
      if (filPrograma2026  !== 'all' && a.programa  !== filPrograma2026)  return false
      if (filLocalidad2026 !== 'all' && a.localidad !== filLocalidad2026) return false
      return true
    })
  }, [data2026, search2026, filPrograma2026, filLocalidad2026])

  const applySearch2026    = (v: string) => { setSearch2026(v);        setPagina2026(1) }
  const applyPrograma2026  = (v: string) => { setFilPrograma2026(v);   setPagina2026(1) }
  const applyLocalidad2026 = (v: string) => { setFilLocalidad2026(v);  setPagina2026(1) }
  const hasFilters2026     = !!(search2026 || filPrograma2026 !== 'all' || filLocalidad2026 !== 'all')
  const clearFilters2026   = () => { setSearch2026(''); setFilPrograma2026('all'); setFilLocalidad2026('all'); setPagina2026(1) }

  // ── Paginación 2026 ───────────────────────────────────────
  const totalPaginas2026 = Math.ceil(filtered2026.length / POR_PAGINA)
  const paginated2026    = filtered2026.slice((pagina2026 - 1) * POR_PAGINA, pagina2026 * POR_PAGINA)

  // ── KPIs 2026 (sobre filtered, igual que 2025) ────────────
  const kpis2026 = useMemo(() => calcularKPIs(filtered2026), [filtered2026])

  // ── Gráficos 2026 (sobre data completa) ───────────────────
  const evolMes2026      = useMemo(() => agruparPorMes(data2026), [data2026])
  const personasMes2026  = useMemo(() => calcularPersonasPorMes(data2026), [data2026])
  const porPrograma2026  = useMemo(() => agruparPorPrograma(data2026), [data2026])
  const porLocalidad2026 = useMemo(() => agruparPorLocalidad(data2026), [data2026])
  const porTematica2026  = useMemo(() => agruparPorTematica(data2026), [data2026])

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

          {loading && (
            <div className="text-center py-16">
              <span className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin inline-block" />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-8 text-red-600 text-sm">
              Error al cargar los datos. Intentá de nuevo más tarde.
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard value={totalActividades.toLocaleString('es-AR')} label="Actividades" />
                <StatCard value={totalPersonas.toLocaleString('es-AR')}    label="Personas alcanzadas" />
                <StatCard value={municipiosUnicos.toLocaleString('es-AR')} label="Municipios alcanzados" />
                <StatCard value={promedio.toLocaleString('es-AR')}         label="Promedio por actividad" />
              </div>

              <div className="divider-fade" />

              {/* Filtros */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por programa o localidad..."
                    value={search}
                    onChange={(e) => applySearch(e.target.value)}
                    className="pl-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2">
                  <Select value={filPrograma} onValueChange={applyPrograma}>
                    <SelectTrigger className="border-slate-200 shadow-sm">
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
                    <SelectTrigger className="border-slate-200 shadow-sm">
                      <SelectValue placeholder="Municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los municipios</SelectItem>
                      {localidadesUnicas.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}
                      className="h-9 text-slate-500 hover:text-slate-900 col-span-2 sm:col-span-1">
                      <X className="h-4 w-4 mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="text-center text-slate-400 italic py-8 text-sm">
                  {hasFilters
                    ? 'No hay actividades que coincidan con los filtros.'
                    : 'Aún no hay actividades registradas para 2025.'}
                </p>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-b border-slate-200/70">
                    <span className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{filtered.length}</span> actividades
                    </span>
                    <span className="text-xs text-slate-500">
                      <span className="font-semibold text-blue-700">{totalPersonas.toLocaleString('es-AR')}</span>{' '}
                      personas alcanzadas
                    </span>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50/60">
                          {['Fecha', 'Municipio / Comuna', 'Programa', 'Personas', 'Cargado por'].map((h) => (
                            <th key={h} className="text-left px-5 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-200/70">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((a, i) => (
                          <tr key={i} className="hover:bg-blue-50/25 border-b border-slate-100 last:border-0 transition-colors">
                            <td className="px-5 py-3 text-slate-600 tabular-nums whitespace-nowrap">{formatFecha(a.fecha)}</td>
                            <td className="px-5 py-3 font-medium text-slate-800">{a.localidad || '-'}</td>
                            <td className="px-5 py-3 text-slate-700">{a.programa || '-'}</td>
                            <td className="px-5 py-3 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                {(parseInt(String(a.cantidad_personas)) || 0).toLocaleString('es-AR')}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-400 text-xs">{a.usuario_nombre || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden divide-y divide-slate-100">
                    {paginated.map((a, i) => (
                      <div key={i} className="px-4 py-4 hover:bg-blue-50/20 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-600 text-sm font-medium tabular-nums">{formatFecha(a.fecha)}</span>
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
                        Página <span className="font-semibold text-slate-700">{pagina}</span> de{' '}
                        <span className="font-semibold text-slate-700">{totalPaginas}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => setPagina(1)} disabled={pagina === 1}
                          className="h-8 w-8 p-0 border-slate-200 text-slate-600 disabled:opacity-40">«</Button>
                        <Button variant="outline" size="sm" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}
                          className="h-8 px-3 border-slate-200 text-slate-600 disabled:opacity-40">Anterior</Button>
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
                                <Button key={n} variant={pagina === n ? 'default' : 'outline'} size="sm"
                                  onClick={() => setPagina(n as number)}
                                  className={`h-8 w-8 p-0 text-sm ${pagina === n ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                                  {n}
                                </Button>
                              )
                            )}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
                          className="h-8 px-3 border-slate-200 text-slate-600 disabled:opacity-40">Siguiente</Button>
                        <Button variant="outline" size="sm" onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}
                          className="h-8 w-8 p-0 border-slate-200 text-slate-600 disabled:opacity-40">»</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Gráficos 2025 */}
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

      {/* ── Tab 2026 ── */}
      <TabsContent value="2026" className="mt-4 animate-in fade-in-0 duration-200 space-y-6">

        {/* Sección 1: Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
                  <BarChart2 className="text-white w-4 h-4" />
                </div>
                <h2 className="text-slate-800 font-black text-xl">Actividades 2026</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En vivo
                </span>
              </div>
              <p className="text-sm text-slate-400 ml-11">
                Datos en tiempo real · Actualizado automáticamente
              </p>
            </div>
            <Button
              onClick={fetchData2026}
              disabled={loading2026}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 self-start sm:self-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading2026 ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Skeleton carga */}
        {(loading2026 || !hasFetched2026) && !error2026 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-glow bg-white border border-slate-100 rounded-2xl p-5 text-center">
                  <Skeleton className="h-3 w-10 mx-auto mb-3 rounded-xl" />
                  <Skeleton className="h-8 w-20 mx-auto mb-2" />
                  <Skeleton className="h-3 w-28 mx-auto" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          </div>
        )}

        {/* Error */}
        {error2026 && !loading2026 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center">
            <p className="text-red-500 text-sm font-medium">
              Error al cargar los datos. Intentá de nuevo más tarde.
            </p>
          </div>
        )}

        {/* Contenido principal */}
        {hasFetched2026 && !loading2026 && !error2026 && (
          <>
            {data2026.length === 0 ? (
              /* Sección 4: Estado vacío */
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Calendar className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-slate-700 font-semibold text-base mb-2">
                  Todavía no hay actividades registradas para 2026
                </p>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Los datos aparecerán aquí automáticamente una vez que se registren actividades mediante el formulario.
                </p>
              </div>
            ) : (
              <>
                {/* Sección 2: KPI Cards */}
                <motion.div
                  variants={staggerCards}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <motion.div variants={fadeUpCard}>
                    <KPICard
                      icon={<Calendar className="w-5 h-5 text-blue-600" />}
                      value={kpis2026.total.toLocaleString('es-AR')}
                      label="Actividades registradas"
                    />
                  </motion.div>
                  <motion.div variants={fadeUpCard}>
                    <KPICard
                      icon={<Users className="w-5 h-5 text-emerald-600" />}
                      value={kpis2026.personas.toLocaleString('es-AR')}
                      label="Personas alcanzadas"
                    />
                  </motion.div>
                  <motion.div variants={fadeUpCard}>
                    <KPICard
                      icon={<MapPin className="w-5 h-5 text-violet-600" />}
                      value={kpis2026.localidades.toLocaleString('es-AR')}
                      label="Municipios cubiertos"
                    />
                  </motion.div>
                  <motion.div variants={fadeUpCard}>
                    <KPICard
                      icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
                      value={kpis2026.promedio.toLocaleString('es-AR')}
                      label="Promedio por actividad"
                    />
                  </motion.div>
                </motion.div>

                {/* Listado de actividades 2026 */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-8 space-y-6">

                  <div className="divider-fade" />

                  {/* Filtros */}
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Buscar por programa o localidad..."
                        value={search2026}
                        onChange={(e) => applySearch2026(e.target.value)}
                        className="pl-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2">
                      <Select value={filPrograma2026} onValueChange={applyPrograma2026}>
                        <SelectTrigger className="border-slate-200 shadow-sm">
                          <SelectValue placeholder="Programa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los programas</SelectItem>
                          {programasUnicos2026.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filLocalidad2026} onValueChange={applyLocalidad2026}>
                        <SelectTrigger className="border-slate-200 shadow-sm">
                          <SelectValue placeholder="Municipio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los municipios</SelectItem>
                          {localidadesUnicas2026.map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {hasFilters2026 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters2026}
                          className="h-9 text-slate-500 hover:text-slate-900 col-span-2 sm:col-span-1">
                          <X className="h-4 w-4 mr-1" />
                          Limpiar
                        </Button>
                      )}
                    </div>
                  </div>

                  {filtered2026.length === 0 ? (
                    <p className="text-center text-slate-400 italic py-8 text-sm">
                      No hay actividades que coincidan con los filtros.
                    </p>
                  ) : (
                    <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
                      {/* Resumen barra */}
                      <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-b border-slate-200/70">
                        <span className="text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{filtered2026.length}</span> actividades
                        </span>
                        <span className="text-xs text-slate-500">
                          <span className="font-semibold text-blue-700">
                            {kpis2026.personas.toLocaleString('es-AR')}
                          </span>{' '}
                          personas alcanzadas
                        </span>
                      </div>

                      {/* Desktop: tabla */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50/60">
                              {['Fecha', 'Municipio / Comuna', 'Programa', 'Temática', 'Personas', 'Cargado por'].map((h) => (
                                <th key={h} className="text-left px-5 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-200/70">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {paginated2026.map((a, i) => (
                              <tr key={i} className="hover:bg-blue-50/25 border-b border-slate-100 last:border-0 transition-colors">
                                <td className="px-5 py-3 text-slate-600 tabular-nums whitespace-nowrap">{formatFecha(a.fecha)}</td>
                                <td className="px-5 py-3 font-medium text-slate-800">{a.localidad || '-'}</td>
                                <td className="px-5 py-3 text-slate-700">{a.programa || '-'}</td>
                                <td className="px-5 py-3 text-slate-500 text-xs max-w-[160px] truncate">{a.tematica || '-'}</td>
                                <td className="px-5 py-3 text-center">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                    {(parseInt(String(a.cantidad_personas)) || 0).toLocaleString('es-AR')}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-slate-400 text-xs">{a.usuario_nombre || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile: cards */}
                      <div className="sm:hidden divide-y divide-slate-100">
                        {paginated2026.map((a, i) => (
                          <div key={i} className="px-4 py-4 hover:bg-blue-50/20 transition-colors">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-slate-600 text-sm font-medium tabular-nums">{formatFecha(a.fecha)}</span>
                              <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-100">
                                {(parseInt(String(a.cantidad_personas)) || 0).toLocaleString('es-AR')} personas
                              </span>
                            </div>
                            <p className="text-slate-800 text-sm font-semibold truncate">{a.programa || '-'}</p>
                            {a.tematica && (
                              <p className="text-slate-400 text-xs truncate mt-0.5">{a.tematica}</p>
                            )}
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-slate-500 text-xs">{a.localidad || '-'}</span>
                              <span className="text-slate-400 text-xs truncate max-w-[150px]">{a.usuario_nombre || '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Paginación */}
                      {totalPaginas2026 > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200/70 bg-slate-50/80">
                          <span className="text-xs text-slate-500">
                            Página <span className="font-semibold text-slate-700">{pagina2026}</span> de{' '}
                            <span className="font-semibold text-slate-700">{totalPaginas2026}</span>
                          </span>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => setPagina2026(1)} disabled={pagina2026 === 1}
                              className="h-8 w-8 p-0 border-slate-200 text-slate-600 disabled:opacity-40">«</Button>
                            <Button variant="outline" size="sm" onClick={() => setPagina2026((p) => Math.max(1, p - 1))} disabled={pagina2026 === 1}
                              className="h-8 px-3 border-slate-200 text-slate-600 disabled:opacity-40">Anterior</Button>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalPaginas2026 }, (_, i) => i + 1)
                                .filter((n) => n === 1 || n === totalPaginas2026 || Math.abs(n - pagina2026) <= 1)
                                .reduce<(number | '…')[]>((acc, n, idx, arr) => {
                                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('…')
                                  acc.push(n)
                                  return acc
                                }, [])
                                .map((n, idx) =>
                                  n === '…' ? (
                                    <span key={`e${idx}`} className="px-1 text-slate-400 text-sm">…</span>
                                  ) : (
                                    <Button key={n} variant={pagina2026 === n ? 'default' : 'outline'} size="sm"
                                      onClick={() => setPagina2026(n as number)}
                                      className={`h-8 w-8 p-0 text-sm ${pagina2026 === n ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                                      {n}
                                    </Button>
                                  )
                                )}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setPagina2026((p) => Math.min(totalPaginas2026, p + 1))} disabled={pagina2026 === totalPaginas2026}
                              className="h-8 px-3 border-slate-200 text-slate-600 disabled:opacity-40">Siguiente</Button>
                            <Button variant="outline" size="sm" onClick={() => setPagina2026(totalPaginas2026)} disabled={pagina2026 === totalPaginas2026}
                              className="h-8 w-8 p-0 border-slate-200 text-slate-600 disabled:opacity-40">»</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sección 3: Gráficos */}
                <div className="space-y-6">

                  {/* G1: BarChart Evolución mensual */}
                  <ChartCard
                    title="Evolución Mensual de Actividades"
                    subtitle="Cantidad de actividades realizadas por mes · 2026"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={evolMes2026} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(43,84,194,0.04)' }} formatter={(v: number) => [v, 'Actividades']} />
                        <Bar dataKey="cantidad" fill="#2b54c2" radius={[4, 4, 0, 0]} name="Actividades" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* G2: AreaChart Personas por mes */}
                  <ChartCard
                    title="Personas Alcanzadas por Mes"
                    subtitle="Total de participantes acumulados por mes · 2026"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={personasMes2026}>
                        <defs>
                          <linearGradient id="gradPersonas2026" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#2b54c2" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#2b54c2" stopOpacity={0}    />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toLocaleString('es-AR'), 'Personas']} />
                        <Area type="monotone" dataKey="personas" stroke="#2b54c2" strokeWidth={2.5}
                          fill="url(#gradPersonas2026)" name="Personas"
                          dot={{ fill: '#2b54c2', strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 5, fill: '#1e3d8f' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* G3 + G4: grid 2 columnas */}
                  <div className="grid lg:grid-cols-2 gap-6">

                    {/* G3: Donut por programa */}
                    <ChartCard title="Distribución por Programa" subtitle="Actividades por campaña o proyecto · 2026">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={porPrograma2026.slice(0, 7).map((d) => ({ name: d.programa, value: d.cantidad }))}
                            cx="50%" cy="50%"
                            innerRadius={55} outerRadius={90} paddingAngle={2}
                            dataKey="value" labelLine={false}
                            label={({ name, percent }) =>
                              percent > 0.05
                                ? `${(name as string).split(' ')[0]} ${(percent * 100).toFixed(0)}%`
                                : ''
                            }
                          >
                            {porPrograma2026.slice(0, 7).map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Actividades']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* G4: BarChart horizontal top municipios */}
                    <ChartCard title="Top Municipios" subtitle="Municipios con más actividades registradas · 2026">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={porLocalidad2026.slice(0, 8).map((d) => ({ nombre: d.localidad, valor: d.cantidad }))}
                          layout="vertical" barSize={13}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={145} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Actividades']} />
                          <Bar dataKey="valor" fill="#4a72d8" radius={[0, 4, 4, 0]} name="Actividades" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>

                  </div>

                  {/* G5: BarChart horizontal temáticas */}
                  <ChartCard
                    title="Temáticas más Trabajadas"
                    subtitle="Distribución de actividades por temática · 2026"
                    height={340}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={porTematica2026.slice(0, 10).map((d) => ({ nombre: d.tematica, valor: d.cantidad }))}
                        layout="vertical" barSize={13}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={200} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Actividades']} />
                        <Bar dataKey="valor" radius={[0, 4, 4, 0]} name="Actividades">
                          {porTematica2026.slice(0, 10).map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                </div>
              </>
            )}
          </>
        )}

        {/* Sección 5: Tablero Power BI estático */}
        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap px-1">
            Tablero Power BI — Análisis complementario
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-200 to-transparent" />
        </div>

        <div className="glass card-glow rounded-2xl overflow-hidden border border-blue-100/60 shadow-[0_8px_32px_rgba(43,84,194,.10)]">
          {/* Imagen con overlay y botón centrado */}
          <div className="relative w-full group">
            <Image
              src="/tablero-2026.png"
              alt="Tablero Power BI 2026"
              width={1600}
              height={900}
              className="w-full h-auto rounded-t-2xl object-cover block"
              priority={false}
            />
            {/* Overlay degradado */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent rounded-t-2xl" />
            {/* Botón centrado sobre la imagen */}
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href="https://frtutneduar-my.sharepoint.com/:u:/g/personal/marcos_rigo_alu_frt_utn_edu_ar/IQBhg25vUZFeRbD_VtwLnyidAeaNnbiE0EvaDaJdr29-i0k"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2.5
                  px-5 py-3 sm:px-7 sm:py-3.5
                  rounded-xl
                  bg-white/95 hover:bg-white
                  text-blue-700 hover:text-blue-800
                  font-semibold text-sm sm:text-base
                  shadow-[0_4px_24px_rgba(0,0,0,.22)]
                  border border-white/80
                  backdrop-blur-sm
                  transition-all duration-200
                  hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,.28)]
                  active:scale-100
                "
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                Ver tablero completo
              </a>
            </div>
          </div>
          {/* Pie de card */}
          <div className="px-5 py-4 sm:px-7 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/60 backdrop-blur-sm border-t border-blue-100/40">
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Actualizado manualmente · Power BI Desktop
            </p>
            <a
              href="https://frtutneduar-my.sharepoint.com/:u:/g/personal/marcos_rigo_alu_frt_utn_edu_ar/IQBhg25vUZFeRbD_VtwLnyidAeaNnbiE0EvaDaJdr29-i0k"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir en SharePoint
            </a>
          </div>
        </div>

      </TabsContent>
    </Tabs>
  )
}
