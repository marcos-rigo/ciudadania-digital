'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { sbGetActividades } from '@/lib/supabase-client'
import { BarChart2, List } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PowerBIEmbed } from './PowerBIEmbed'
import type { AnioFilter } from '@/types/powerbi'

interface Actividad {
  fecha: string
  programa: string
  localidad: string
  cantidad_personas: number
  usuario_nombre: string
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#f8fafc] border border-[#e8edf3] rounded-xl p-5 text-center">
      <div className="text-4xl font-black text-[#1A2A36] leading-none">{value}</div>
      <div className="text-xs text-[#64748b] mt-1.5">{label}</div>
    </div>
  )
}

const FILTRO_2025 = '&fecha=gte.2025-01-01&fecha=lt.2026-01-01'

export function PanelEstadisticas({ rol }: { rol: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Año activo derivado de la URL; default 2025
  const anioParam = searchParams.get('anio')
  const anio: AnioFilter = anioParam === '2026' ? '2026' : '2025'

  function handleAnioChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === '2025') params.delete('anio')
    else params.set('anio', value)
    const qs = params.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  // ── Datos Supabase (solo para tab 2025) ────────────────────────────
  const [ultimas, setUltimas] = useState<Actividad[]>([])
  const [todas, setTodas] = useState<{ cantidad_personas: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (anio !== '2025') return
    setLoading(true)
    setError(false)
    async function cargar() {
      try {
        const [ult, tod] = await Promise.all([
          sbGetActividades(
            `select=fecha,programa,localidad,cantidad_personas,usuario_nombre&order=created_at.desc&limit=10${FILTRO_2025}`
          ),
          sbGetActividades(`select=cantidad_personas${FILTRO_2025}`),
        ])
        setUltimas(ult as Actividad[])
        setTodas(tod as { cantidad_personas: number }[])
      } catch (err) {
        console.error('PanelEstadisticas error:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [anio])

  const total = todas.length
  const totalPersonas = todas.reduce((s, r) => s + (parseInt(String(r.cantidad_personas)) || 0), 0)
  const promedio = total > 0 ? Math.round(totalPersonas / total) : 0

  return (
    <Tabs value={anio} onValueChange={handleAnioChange} className="w-full">
      {/* Selector de año */}
      <TabsList className="bg-[#f1f5f9] p-1 h-auto rounded-xl shadow-none border-0 gap-1">
        <TabsTrigger
          value="2025"
          className="px-5 py-2 rounded-lg text-sm font-semibold data-[state=active]:bg-[#4272bb] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-[#64748b] data-[state=inactive]:bg-transparent border-0"
        >
          2025
        </TabsTrigger>
        <TabsTrigger
          value="2026"
          className="px-5 py-2 rounded-lg text-sm font-semibold data-[state=active]:bg-[#4272bb] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-[#64748b] data-[state=inactive]:bg-transparent border-0"
        >
          2026
        </TabsTrigger>
      </TabsList>

      {/* ── Tab 2025: estadísticas Supabase ── */}
      <TabsContent
        value="2025"
        className="mt-4 animate-in fade-in-0 duration-200"
      >
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-4 sm:p-8">
          <h2 className="text-[#1A2A36] font-black text-xl flex items-center gap-2 mb-6">
            <span className="w-8 h-8 bg-[#4272bb] rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart2 className="text-white w-4 h-4" />
            </span>
            Estadísticas de actividades · 2025
          </h2>

          {loading && (
            <div className="text-center py-12 text-[#94a3b8]">
              <span className="w-8 h-8 border-2 border-[#e2e8f0] border-t-[#4272bb] rounded-full animate-spin inline-block" />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-8 text-red-600 text-sm">
              Error al cargar los datos. Intentá de nuevo más tarde.
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard value={total.toLocaleString('es-AR')} label="Actividades registradas" />
                <StatCard value={totalPersonas.toLocaleString('es-AR')} label="Personas alcanzadas" />
                <StatCard value={promedio.toLocaleString('es-AR')} label="Promedio por actividad" />
              </div>

              <h3 className="text-[#1A2A36] font-bold flex items-center gap-2 mb-3 text-sm">
                <span className="w-7 h-7 bg-slate-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <List className="text-white w-3.5 h-3.5" />
                </span>
                Últimas 10 actividades
                <span className="text-[#94a3b8] font-normal">· 2025</span>
              </h3>

              {ultimas.length === 0 ? (
                <p className="text-center text-[#94a3b8] italic py-8 text-sm">
                  Aún no hay actividades registradas para 2025
                </p>
              ) : (
                <>
                  {/* Mobile: cards */}
                  <div className="sm:hidden space-y-3">
                    {ultimas.map((a, i) => (
                      <div key={i} className="bg-[#f6f7f8] border border-[#e2e8f0] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#1A2A36] font-semibold text-sm">
                            {a.fecha
                              ? new Date(a.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
                                  day: '2-digit', month: '2-digit', year: 'numeric',
                                })
                              : '-'}
                          </span>
                          <span className="bg-[#4272bb]/10 text-[#4272bb] font-bold text-xs px-2.5 py-0.5 rounded-full">
                            {(parseInt(String(a.cantidad_personas)) || 0).toLocaleString('es-AR')} personas
                          </span>
                        </div>
                        <p className="text-[#1A2A36] text-sm font-medium truncate mb-1">{a.programa || '-'}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[#64748b] text-xs">{a.localidad || '-'}</span>
                          <span className="text-[#94a3b8] text-xs truncate max-w-[140px]">{a.usuario_nombre || '-'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          {['Fecha', 'Programa', 'Localidad', 'Personas', 'Cargado por'].map(h => (
                            <th
                              key={h}
                              className="text-left px-4 py-2.5 bg-[#f6f7f8] text-[#64748b] font-semibold text-xs uppercase tracking-wide border-b border-[#e2e8f0]"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ultimas.map((a, i) => (
                          <tr key={i} className="hover:bg-[#fafbfc] border-b border-[#f1f5f9] last:border-0">
                            <td className="px-4 py-2.5 text-[#1A2A36]">
                              {a.fecha
                                ? new Date(a.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                  })
                                : '-'}
                            </td>
                            <td className="px-4 py-2.5 text-[#1A2A36]">{a.programa || '-'}</td>
                            <td className="px-4 py-2.5 text-[#1A2A36]">{a.localidad || '-'}</td>
                            <td className="px-4 py-2.5 text-[#1A2A36]">
                              {(parseInt(String(a.cantidad_personas)) || 0).toLocaleString('es-AR')}
                            </td>
                            <td className="px-4 py-2.5 text-[#1A2A36]">{a.usuario_nombre || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </TabsContent>

      {/* ── Tab 2026: Power BI embed ── */}
      <TabsContent
        value="2026"
        className="mt-4 animate-in fade-in-0 duration-200"
      >
        <PowerBIEmbed />
      </TabsContent>
    </Tabs>
  )
}
