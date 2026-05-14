'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, LayoutDashboard, Globe, Users, BarChart2, Menu, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const BADGE: Record<string, { cls: string; label: string }> = {
  superadmin: {
    cls: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    label: 'Superadmin',
  },
  empleado: {
    cls: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    label: 'Empleado',
  },
  lector: {
    cls: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
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
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => pathname.startsWith(href)
  const cargaActive = isActive('/dashboard/admin') && !isActive('/dashboard/admin/usuarios')

  const puedeCargar      = rol === 'superadmin' || rol === 'empleado'
  const puedeVerUsuarios = rol === 'superadmin'

  const navLinkCls = (active: boolean) =>
    cn(
      'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2',
      active
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10'
        : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
    )

  const mobileNavLinkCls = (active: boolean) =>
    cn(
      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full',
      active
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-cyan-400'
    )

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full bg-[#050810]/95 backdrop-blur-xl border-b border-slate-800/50">
        {/* Accent bar */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <div className="flex h-16 items-center px-4 lg:px-8 gap-4">
          {/* Hamburger — solo mobile */}
          <button
            className="lg:hidden flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menú de navegación"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/inicio" className="flex items-center shrink-0 group">
            <div className="relative h-10 w-36 sm:h-14 sm:w-48">
              <Image
                src="/logo1.png"
                alt="Secretaría de Participación Ciudadana"
                fill
                className="object-contain transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Nav centrado */}
          <div className="flex-1 flex items-center justify-center">
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/inicio" className={navLinkCls(false)}>
                <Globe className="w-4 h-4" />
                Inicio
              </Link>
              {puedeCargar && (
                <Link href="/dashboard/admin" className={navLinkCls(cargaActive)}>
                  <LayoutDashboard className="w-4 h-4" />
                  Carga
                </Link>
              )}
              <Link href="/dashboard/estadisticas" className={navLinkCls(isActive('/dashboard/estadisticas'))}>
                <BarChart2 className="w-4 h-4" />
                Estadísticas
              </Link>
              {puedeVerUsuarios && (
                <Link href="/dashboard/admin/usuarios" className={navLinkCls(isActive('/dashboard/admin/usuarios'))}>
                  <Users className="w-4 h-4" />
                  Usuarios
                </Link>
              )}
            </nav>
          </div>

          {/* Derecha: usuario + logout */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Chip de usuario — desktop */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/50 border border-slate-700/50 rounded-full pl-3 pr-2 py-1.5 hover:border-cyan-500/20 transition-all">
              <span className="text-sm font-medium text-slate-300 max-w-[140px] truncate">
                {nombre}
              </span>
              <span className={cn('text-[11px] font-bold px-2.5 py-0.5 rounded-full', badge.cls)}>
                {badge.label}
              </span>
            </div>

            {/* Solo badge en mobile */}
            <span className={cn('sm:hidden text-[11px] font-bold px-2.5 py-1 rounded-full', badge.cls)}>
              {badge.label}
            </span>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-900/50 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/30 rounded-lg transition-all duration-200 text-slate-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-800/50 bg-[#0d1220]/98 backdrop-blur-xl px-4 py-3 space-y-1 shadow-2xl shadow-cyan-500/5">
            {/* Info de usuario en mobile */}
            <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-slate-900/50 rounded-xl border border-slate-800/50">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{nombre}</p>
                <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', badge.cls)}>
                  {badge.label}
                </span>
              </div>
            </div>

            <Link href="/inicio" onClick={() => setMenuOpen(false)} className={mobileNavLinkCls(false)}>
              <Globe className="w-4 h-4" /> Inicio
            </Link>
            {puedeCargar && (
              <Link href="/dashboard/admin" onClick={() => setMenuOpen(false)} className={mobileNavLinkCls(cargaActive)}>
                <LayoutDashboard className="w-4 h-4" /> Carga
              </Link>
            )}
            <Link href="/dashboard/estadisticas" onClick={() => setMenuOpen(false)} className={mobileNavLinkCls(isActive('/dashboard/estadisticas'))}>
              <BarChart2 className="w-4 h-4" /> Estadísticas
            </Link>
            {puedeVerUsuarios && (
              <Link href="/dashboard/admin/usuarios" onClick={() => setMenuOpen(false)} className={mobileNavLinkCls(isActive('/dashboard/admin/usuarios'))}>
                <Users className="w-4 h-4" /> Usuarios
              </Link>
            )}

            <div className="pt-2 border-t border-slate-800/50">
              <button
                onClick={() => { setMenuOpen(false); handleLogout() }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 bg-content-subtle">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-[#0a1020]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Secretaría de Participación Ciudadana · Uso interno
            </p>
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-32 opacity-70">
                <Image src="/logo1.png" alt="SPC Tucumán" fill className="object-contain" />
              </div>
              <div className="relative h-10 w-32 opacity-70">
                <Image src="/logo2.png" alt="Gobierno de Tucumán" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}