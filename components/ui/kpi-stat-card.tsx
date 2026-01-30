import { cn } from "@/lib/utils"
import { Calendar, MapPin, Users, FolderOpen, TrendingUp, Map, FileText, Type as type, LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  calendar: Calendar,
  "map-pin": MapPin,
  users: Users,
  folder: FolderOpen,
  "trending-up": TrendingUp,
  map: Map,
  "file-text": FileText,
}

interface KPIStatCardProps {
  titulo: string
  valor: string | number
  descripcion?: string
  variacion?: number
  icono?: string
  className?: string
}

export function KPIStatCard({
  titulo,
  valor,
  descripcion,
  variacion,
  icono,
  className,
}: KPIStatCardProps) {
  const Icon = icono ? iconMap[icono] || Calendar : Calendar

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">
            {valor}
          </p>
          {descripcion && (
            <p className="text-xs text-muted-foreground">{descripcion}</p>
          )}
          {variacion !== undefined && (
            <p
              className={cn(
                "text-xs font-medium",
                variacion > 0 ? "text-green-600" : variacion < 0 ? "text-red-600" : "text-muted-foreground"
              )}
            >
              {variacion > 0 ? "+" : ""}
              {variacion}% vs mes anterior
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {/* Decorative element */}
      <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-primary/5" />
    </div>
  )
}
