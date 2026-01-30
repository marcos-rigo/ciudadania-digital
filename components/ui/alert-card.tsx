import { cn } from "@/lib/utils"
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react"
import type { Alerta } from "@/lib/types"

interface AlertCardProps {
  alerta: Alerta
  className?: string
}

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
  error: XCircle,
}

const colorMap = {
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
}

const iconColorMap = {
  warning: "text-yellow-600",
  info: "text-blue-600",
  success: "text-green-600",
  error: "text-red-600",
}

export function AlertCard({ alerta, className }: AlertCardProps) {
  const Icon = iconMap[alerta.tipo]

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border",
        colorMap[alerta.tipo],
        className
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColorMap[alerta.tipo])} />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{alerta.titulo}</p>
        <p className="text-sm opacity-80 mt-0.5">{alerta.descripcion}</p>
      </div>
      <span className="text-xs opacity-60 shrink-0">
        {new Date(alerta.fecha).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
        })}
      </span>
    </div>
  )
}
