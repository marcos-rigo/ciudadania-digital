'use client'

import { RefreshCw, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  isLoading: boolean
  isPaused: boolean
  onRefresh: () => void
  onTogglePause: () => void
}

export function RefreshButton({ isLoading, isPaused, onRefresh, onTogglePause }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="h-8 gap-1.5 text-xs border-[#e2e8f0] text-[#475569] hover:text-[#1A2A36]"
        title="Actualizar datos"
      >
        <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
        {isLoading ? 'Actualizando…' : 'Actualizar'}
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onTogglePause}
        title={isPaused ? 'Reanudar auto-actualización' : 'Pausar auto-actualización'}
        className="h-8 w-8 text-[#94a3b8] hover:text-[#475569]"
      >
        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </Button>
    </div>
  )
}
