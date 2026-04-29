'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, CircleUser, LayoutDashboard, Globe, Users, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const BADGE: Record<string, { cls: string; label: string }> = {
  superadmin: {
    cls: 'bg-orange-100 text-orange-800 border border-orange-300',
    label: 'Superadmin',
  },
  empleado: {
    cls: 'bg-sky-100 text-sky-700 border border-sky-200',
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
      'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs',
      active
        ? 'bg-white/30 border border-white/40'
        : 'bg-white/10 hover:bg-white/20 border border-white/20'
    )

  const puedeCargar = rol === 'superadmin' || rol === 'empleado'
  const puedeVerUsuarios = rol === 'superadmin'

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <header
        className="text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1A2A36 0%, #2d4a6e 60%, #4272bb 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
              Uso interno · Equipo
            </p>
            <h1 className="text-lg font-black leading-tight">
              Informe de Gestión <span className="text-[#a8c4f0]">2026</span>
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

            <Link
              href="/inicio"
              className={linkCls(false)}
            >
              <Globe className="w-3.5 h-3.5" />
              Sitio
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs">
              <CircleUser className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline max-w-[120px] truncate">{nombre}</span>
              <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', badge.cls)}>
                {badge.label}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
