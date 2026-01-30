'use client';

import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface TagChipsProps {
  tags: string[]
  onRemove?: (tag: string) => void
  variant?: "default" | "primary" | "secondary" | "outline"
  size?: "sm" | "md"
  className?: string
}

export function TagChips({
  tags,
  onRemove,
  variant = "default",
  size = "sm",
  className,
}: TagChipsProps) {
  const variantStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-transparent text-foreground",
  }

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={cn(
            "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
            variantStyles[variant],
            sizeStyles[size],
            onRemove && "pr-1"
          )}
        >
          {tag}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
              aria-label={`Eliminar ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  )
}
