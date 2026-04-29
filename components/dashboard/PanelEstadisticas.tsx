'use client'
import { useEffect, useState } from 'react'
import { sbGetActividades } from '@/lib/supabase-client'
import { BarChart2, List } from 'lucide-react'

type Año = '2025' | '2026' | 'total'

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

const FILTRO_FECHA: Record<Año, string> = {
  '2025': '&fecha=gte.2025-01-01&fecha=lt.2026-01-01',
  '2026': '&fecha=gte.2026-01-01&fecha=lt.2027-01-01',
  'total': '',
}

const LABEL_AÑO: Record<Año, string> = {
  '2025': '2025',
  '2026': '2026',
  'total': 'Total',
}

export function PanelEstadisticas({ rol }: { rol: string }) {
  const [año, setAño] = useState<Año>('total')
  const [ultimas, setUltimas] = useState<Actividad[]>([])
  const [todas, setTodas] = useState<{ cantidad_personas: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    const f = FILTRO_FECHA[año]
    async function cargar() {
      try {
        const [ult, tod] = await Promise.all([
          sbGetActividades(
            `select=fecha,programa,localidad,cantidad_personas,usuario_nombre&order=created_at.desc&limit=10${f}`
          ),
          sbGetActividades(`select=cantidad_personas${f}`),
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
  }, [año])

  const total = todas.length
  const totalPersonas = todas.reduce((s, r) => s + (parseInt(String(r.cantidad_personas)) || 0), 0)
  const promedio = total > 0 ? Math.round(totalPersonas / total) : 0

  return (
    <div>
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-[#1A2A36] font-black text-xl flex items-center gap-2">
            <span className="w-8 h-8 bg-[#4272bb] rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart2 className="text-white w-4 h-4" />
            </span>
            Estadísticas de actividades
          </h2>

          {/* Selector de año */}
          <div className="flex items-center bg-[#f1f5f9] rounded-xl p-1 gap-1 self-start sm:self-auto">
            {(['2025', '2026', 'total'] as Año[]).map((a) => (
              <button
                key={a}
                onClick={() => setAño(a)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  año === a
                    ? 'bg-[#4272bb] text-white shadow-sm'
                    : 'text-[#64748b] hover:text-[#1A2A36]'
                }`}
              >
                {LABEL_AÑO[a]}
              </button>
            ))}
          </div>
        </div>

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
              {año !== 'total' && (
                <span className="text-[#94a3b8] font-normal">· {año}</span>
              )}
            </h3>

            {ultimas.length === 0 ? (
              <p className="text-center text-[#94a3b8] italic py-8 text-sm">
                {año === '2026'
                  ? 'Aún no hay actividades registradas para 2026'
                  : 'Aún no hay actividades registradas'}
              </p>
            ) : (
              <div className="overflow-x-auto">
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
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
