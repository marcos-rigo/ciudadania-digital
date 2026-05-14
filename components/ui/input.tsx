import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground text-foreground placeholder:text-slate-500 selection:bg-cyan-500/30 selection:text-cyan-200 border-slate-700 bg-slate-900/50 h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-md shadow-slate-900/20 transition-[color,box-shadow,border-color] outline-none',
        'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg focus:shadow-cyan-500/10',
        'hover:border-slate-600',
        'aria-invalid:ring-red-500/20 aria-invalid:border-red-500',
        className,
      )}
      {...props}
    />
  )
}

export { Input }