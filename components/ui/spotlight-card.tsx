"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps extends React.ComponentProps<"div"> {
  spotlightColor?: string
}

/**
 * Drop-in replacement for <Card> that adds a radial spotlight effect
 * tracking the mouse position. Shares the same base styles as Card.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(79, 143, 255, 0.07)",
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const { left, top } = ref.current.getBoundingClientRect()
    ref.current.style.setProperty("--x", `${e.clientX - left}px`)
    ref.current.style.setProperty("--y", `${e.clientY - top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        // Base card styles (mirrors card.tsx)
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        // Interaction
        "group relative overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:shadow-lg hover:shadow-glow-sm hover:border-primary/20",
        // CSS custom props for spotlight position
        "[--x:50%] [--y:50%]",
        className,
      )}
      {...props}
    >
      {/* Spotlight overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(350px circle at var(--x) var(--y), ${spotlightColor}, transparent 70%)`,
        }}
      />
      {/* Content sits above overlay */}
      <div className="relative z-[1] flex flex-col gap-6 h-full">
        {children}
      </div>
    </div>
  )
}
