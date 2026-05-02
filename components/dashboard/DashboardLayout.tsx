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
      'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium',
      active
        ? 'bg-[#4f8fff]/20 text-[#a8c4f0] border border-[#4f8fff]/35 shadow-[0_0_12px_rgba(79,143,255,0.2)]'
        : 'bg-white/[0.07] text-white/60 hover:bg-white/[0.14] hover:text-white/90 border border-white/[0.12]'
    )

  const puedeCargar = rol === 'superadmin' || rol === 'empleado'
  const puedeVerUsuarios = rol === 'superadmin'

  return (
    <div className="min-h-screen bg-[#f4f6f9] dark:bg-[#09090b]">
      <header
        className="text-white shadow-lg border-b border-white/5"
        style={{ background: 'linear-gradient(135deg, #09090b 0%, #0d1929 55%, #1a2d50 100%)' }}
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
            <div className="flex items-center gap-2 bg-white/[0.07] border border-white/[0.12] rounded-full px-3 py-1.5 text-xs backdrop-blur-sm">
              <CircleUser className="w-4 h-4 flex-shrink-0 text-white/60" />
              <span className="hidden sm:inline max-w-[120px] truncate text-white/80">{nombre}</span>
              <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', badge.cls)}>
                {badge.label}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.12] rounded-full transition-all duration-200 text-white/60 hover:text-white/90"
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
