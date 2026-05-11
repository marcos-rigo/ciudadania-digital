'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  isLoading: boolean
  onRefresh: () => void
}

export function RefreshButton({ isLoading, onRefresh }: Props) {
  return (
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
  )
}
