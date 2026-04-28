'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, CircleUser, LayoutDashboard, Globe, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const BADGE: Record<string, { cls: string; label: string }> = {
  admin:  { cls: 'bg-blue-100 text-blue-700 border border-blue-200',      label: 'Administrador' },
  lector: { cls: 'bg-slate-100 text-slate-600 border border-slate-200',    label: 'Lectura' },
  prueba: { cls: 'bg-yellow-100 text-yellow-800 border border-yellow-200', label: 'Prueba' },
}

interface Props {
  nombre: string
  rol: string
  children: React.ReactNode
}

export function DashboardLayout({ nombre, rol, children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const badge = BADGE[rol] ?? BADGE.admin

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => pathname.startsWith(href)

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

          <nav className="hidden sm:flex items-center gap-1 text-xs">
            {rol === 'admin' && (
              <>
                <Link
                  href="/dashboard/admin"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors',
                    isActive('/dashboard/admin') && !isActive('/dashboard/admin/usuarios')
                      ? 'bg-white/30 border border-white/40'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  )}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Carga
                </Link>
                <Link
                  href="/dashboard/admin/usuarios"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors',
                    isActive('/dashboard/admin/usuarios')
                      ? 'bg-white/30 border border-white/40'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  )}
                >
                  <Users className="w-3.5 h-3.5" />
                  Usuarios
                </Link>
              </>
            )}
            {(rol === 'lector' || rol === 'prueba') && (
              <Link
                href="/dashboard/estadisticas"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Estadísticas
              </Link>
            )}
            <Link
              href="/inicio"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
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
