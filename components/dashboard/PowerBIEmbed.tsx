'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { BarChart2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshButton } from './RefreshButton'
import type { PowerBIEmbedProps, RefreshState } from '@/types/powerbi'

const POWERBI_SRC =
  'https://app.powerbi.com/reportEmbed?reportId=b8b0a508-a804-43fe-b434-193641e9fae4&autoAuth=true&ctid=843d9746-0674-48bf-a402-a45cd06f541a&actionBarEnabled=true'

function formatMinutos(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diff < 1) return 'hace un momento'
  if (diff === 1) return 'hace 1 min'
  return `hace ${diff} min`
}

// Verde <10 min · Amarillo 10-30 min · Rojo >30 min
function badgeClasses(date: Date | null): string {
  if (!date) return 'bg-slate-100 text-slate-500 border-slate-200'
  const min = Math.floor((Date.now() - date.getTime()) / 60000)
  if (min < 10) return 'bg-green-100 text-green-700 border-green-200'
  if (min < 30) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  return 'bg-red-100 text-red-700 border-red-200'
}

export function PowerBIEmbed({
  src = POWERBI_SRC,
  title = 'datos-SPC',
  autoRefreshMinutes = 30,
}: PowerBIEmbedProps) {
  const [iframeKey, setIframeKey] = useState('init')
  const [state, setState] = useState<RefreshState>({
    isLoading: true,
    lastRefresh: null,
    isPaused: false,
  })
  // Tick para re-renderizar el badge de tiempo sin tocar el estado principal
  const [, setTick] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isFirstLoad = useRef(true)

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startInterval = useCallback(() => {
    stopInterval()
    intervalRef.current = setInterval(() => {
      setIframeKey(`auto-${Date.now()}`)
      setState(s => ({ ...s, isLoading: true }))
    }, autoRefreshMinutes * 60 * 1000)
  }, [autoRefreshMinutes, stopInterval])

  // Gestionar el intervalo según isPaused
  useEffect(() => {
    if (!state.isPaused) startInterval()
    else stopInterval()
    return stopInterval
  }, [state.isPaused, startInterval, stopInterval])

  // Pausar auto-refresh cuando la pestaña del browser está inactiva
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) stopInterval()
      else if (!state.isPaused) startInterval()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [state.isPaused, startInterval, stopInterval])

  // Actualizar el texto "hace X min" cada minuto
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  function handleLoad() {
    const now = new Date()
    setState(s => ({ ...s, isLoading: false, lastRefresh: now }))
    if (!isFirstLoad.current) {
      toast.success('Dashboard actualizado', {
        description: `Actualizado a las ${now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
        duration: 3000,
      })
    }
    isFirstLoad.current = false
  }

  function handleRefresh() {
    setIframeKey(`manual-${Date.now()}`)
    setState(s => ({ ...s, isLoading: true }))
  }

  function handleTogglePause() {
    setState(s => ({ ...s, isPaused: !s.isPaused }))
  }

  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-white shadow-sm overflow-hidden">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-[#e8edf3]">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-[#4272bb] rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart2 className="text-white w-4 h-4" />
          </span>
          <div>
            <h3 className="font-black text-[#1A2A36] text-base leading-tight">
              Dashboard Power BI
            </h3>
            <p className="text-xs text-[#64748b]">Informe de Gestión 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Badge de última actualización */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${badgeClasses(state.lastRefresh)}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {state.lastRefresh
              ? `Última actualización: ${formatMinutos(state.lastRefresh)}`
              : 'Cargando…'}
          </span>

          <RefreshButton
            isLoading={state.isLoading}
            isPaused={state.isPaused}
            onRefresh={handleRefresh}
            onTogglePause={handleTogglePause}
          />
        </div>
      </div>

      {/* Contenedor del iframe */}
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px]">
        {/* Skeleton superpuesto mientras carga */}
        {state.isLoading && (
          <div className="absolute inset-0 z-10 bg-white p-4 flex flex-col gap-3">
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="flex-1 w-full rounded-xl" />
          </div>
        )}

        <iframe
          key={iframeKey}
          title={title}
          src={src}
          className="w-full h-full border-0"
          allowFullScreen
          onLoad={handleLoad}
        />

        {/* Hint de scroll en mobile */}
        {!state.isLoading && (
          <div className="absolute bottom-3 right-3 sm:hidden pointer-events-none">
            <span className="bg-black/60 text-white text-[11px] px-2.5 py-1.5 rounded-full backdrop-blur-sm">
              Deslizá para explorar →
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
