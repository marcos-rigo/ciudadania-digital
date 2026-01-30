'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileQuestion, Search, FolderOpen, Type as type, LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function NoResultsState({
  searchTerm,
  className,
}: {
  searchTerm?: string
  className?: string
}) {
  return (
    <EmptyState
      icon={Search}
      title="Sin resultados"
      description={
        searchTerm
          ? `No se encontraron resultados para "${searchTerm}". Intenta con otros términos de búsqueda.`
          : "No se encontraron elementos que coincidan con los filtros aplicados."
      }
      className={className}
    />
  )
}

export function NoDataState({
  entityName,
  className,
}: {
  entityName: string
  className?: string
}) {
  return (
    <EmptyState
      icon={FolderOpen}
      title={`Sin ${entityName}`}
      description={`Aún no hay ${entityName} registrados en el sistema.`}
      className={className}
    />
  )
}
