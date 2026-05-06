'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, LayoutDashboard, Globe, Users, BarChart2, Menu, X } from 'lucide-react'
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
        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    )

  const mobileNavLinkCls = (active: boolean) =>
    cn(
      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full',
      active
        ? 'bg-blue-50 text-blue-700 border border-blue-200'
        : 'text-slate-600 hover:bg-slate-100'
    )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── HEADER — mismo estilo que public-layout ── */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        {/* Accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />

        <div className="flex h-16 items-center px-4 lg:px-8 gap-4">
          {/* Hamburger — solo mobile */}
          <button
            className="lg:hidden flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menú de navegación"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo — idéntico al de /inicio */}
          <Link href="/dashboard/estadisticas" className="flex items-center shrink-0">
            <div className="relative h-14 w-48">
              <Image
                src="/logo1.png"
                alt="Secretaría de Participación Ciudadana"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Nav centrado — mismo estilo que /inicio */}
          <div className="flex-1 flex items-center justify-center">
            <nav className="hidden lg:flex items-center gap-1">
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
              <Link href="/inicio" className={navLinkCls(false)}>
                <Globe className="w-4 h-4" />
                Sitio público
              </Link>
            </nav>
          </div>

          {/* Derecha: usuario + logout */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Badge de usuario */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-3 pr-2 py-1.5">
              <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">
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
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-all duration-200 text-slate-500 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-lg">
            {/* Info de usuario en mobile */}
            <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-slate-50 rounded-xl">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{nombre}</p>
                <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', badge.cls)}>
                  {badge.label}
                </span>
              </div>
            </div>

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
            <Link href="/inicio" onClick={() => setMenuOpen(false)} className={mobileNavLinkCls(false)}>
              <Globe className="w-4 h-4" /> Sitio público
            </Link>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => { setMenuOpen(false); handleLogout() }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {children}
      </main>

      {/* Footer — mismo estilo que /inicio */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Secretaría de Participación Ciudadana · Uso interno
            </p>
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-32">
                <Image src="/logo1.png" alt="SPC Tucumán" fill className="object-contain" />
              </div>
              <div className="relative h-10 w-32">
                <Image src="/logo2.png" alt="Gobierno de Tucumán" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
