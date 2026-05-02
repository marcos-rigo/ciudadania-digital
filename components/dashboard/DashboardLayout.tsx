'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, CircleUser, LayoutDashboard, Globe, Users, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const BADGE: Record<string, { cls: string; label: string }> = {
  superadmin: {
    cls: 'bg-violet-100 text-violet-700 border border-violet-200',
    label: 'Superadmin',
  },
  empleado: {
    cls: 'bg-blue-100 text-blue-700 border border-blue-200',
    label: 'Empleado',
  },
  lector: {
    cls: 'bg-slate-100 text-slate-600 border border-slate-200',
    label: 'Lector',
  },
}

interface Props {
  nombre: string
  rol: string
  children: React.ReactNode
}

export function DashboardLayout({ nombre, rol, children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const badge = BADGE[rol] ?? BADGE.lector

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  const linkCls = (active: boolean) =>
    cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium',
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
    )

  const puedeCargar     = rol === 'superadmin' || rol === 'empleado'
  const puedeVerUsuarios = rol === 'superadmin'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Accent bar top */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />

      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Uso interno · Equipo
            </p>
            <h1 className="text-lg font-black leading-tight text-slate-900">
              Informe de Gestión{' '}
              <span className="text-blue-600">2026</span>
            </h1>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {puedeCargar && (
              <Link
                href="/dashboard/admin"
                className={linkCls(
                  isActive('/dashboard/admin') && !isActive('/dashboard/admin/usuarios')
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Carga
              </Link>
            )}

            <Link
              href="/dashboard/estadisticas"
              className={linkCls(isActive('/dashboard/estadisticas'))}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Estadísticas
            </Link>

            {puedeVerUsuarios && (
              <Link
                href="/dashboard/admin/usuarios"
                className={linkCls(isActive('/dashboard/admin/usuarios'))}
              >
                <Users className="w-3.5 h-3.5" />
                Usuarios
              </Link>
            )}

            <Link href="/inicio" className={linkCls(false)}>
              <Globe className="w-3.5 h-3.5" />
              Sitio
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs">
              <CircleUser className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span className="hidden sm:inline max-w-[120px] truncate text-slate-700 font-medium">
                {nombre}
              </span>
              <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', badge.cls)}>
                {badge.label}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-full transition-all duration-200 text-slate-500 hover:text-red-600"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {children}
      </main>
    </div>
  )
}
