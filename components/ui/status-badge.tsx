import { cn } from "@/lib/utils"
import type { EstadoPrograma, Modalidad, NivelCapacitacion, Sentimiento } from "@/lib/types"

type StatusType = EstadoPrograma | Modalidad | NivelCapacitacion | Sentimiento | string

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Estados de programa
  activo: {
    label: "Activo",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  en_pausa: {
    label: "En Pausa",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  finalizado: {
    label: "Finalizado",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  // Modalidades
  presencial: {
    label: "Presencial",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  virtual: {
    label: "Virtual",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  hibrido: {
    label: "Híbrido",
    className: "bg-teal-100 text-teal-800 border-teal-200",
  },
  // Niveles
  basico: {
    label: "Básico",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  intermedio: {
    label: "Intermedio",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  avanzado: {
    label: "Avanzado",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  // Sentimientos
  positivo: {
    label: "Positivo",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  neutral: {
    label: "Neutral",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  negativo: {
    label: "Negativo",
    className: "bg-red-100 text-red-800 border-red-200",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
