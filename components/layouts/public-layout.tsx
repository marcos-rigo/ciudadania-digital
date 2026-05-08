"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart3, LogIn, LogOut, LayoutDashboard, Menu, X } from "lucide-react"

const NAV_ITEMS = [
  { href: "/acciones",   label: "Acciones",   icon: Calendar  },
  { href: "/resultados", label: "Resultados", icon: BarChart3 },
]

interface SpcAuth {
  nombre: string
  rol: string
}

function readSpcAuth(): SpcAuth | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.split(";").find((c) => c.trim().startsWith("spc_auth="))
  if (!match) return null
  try {
    const raw = decodeURIComponent(match.trim().slice("spc_auth=".length))
    // soporta cookie vieja (="1") y nueva (=JSON)
    if (raw === "1") return { nombre: "", rol: "" }
    return JSON.parse(raw) as SpcAuth
  } catch {
    return null
  }
}

const BADGE: Record<string, { cls: string; label: string }> = {
  superadmin: { cls: "bg-violet-100 text-violet-700 border border-violet-200", label: "Superadmin" },
  empleado:   { cls: "bg-blue-100 text-blue-700 border border-blue-200",       label: "Empleado"   },
  lector:     { cls: "bg-slate-100 text-slate-600 border border-slate-200",     label: "Lector"     },
}

function dashboardHref(rol: string) {
  if (rol === "superadmin") return "/dashboard/admin/usuarios"
  if (rol === "empleado")   return "/dashboard/admin"
  return "/dashboard/estadisticas"
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [user, setUser]       = useState<SpcAuth | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setUser(readSpcAuth())
  }, [])

  // Cerrar menú al cambiar ruta
  useEffect(() => { setMenuOpen(false) }, [pathname])

  async function handleLogout() {
    setMenuOpen(false)
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/inicio")
    router.refresh()
  }

  const loggedIn = user !== null
  const badge    = BADGE[user?.rol ?? ""] ?? null
  const href     = dashboardHref(user?.rol ?? "")

  const navLinkCls = (active: boolean) =>
    cn(
      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
      active
        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    )

  const mobileNavLinkCls = (active: boolean) =>
    cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full",
      active
        ? "bg-blue-50 text-blue-700 border border-blue-200"
        : "text-slate-600 hover:bg-slate-100"
    )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        {/* Accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />

        <div className="flex h-16 items-center px-4 lg:px-8 gap-2">

          {/* Hamburger — solo mobile */}
          <button
            className="lg:hidden flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú de navegación"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/inicio" className="flex items-center shrink-0">
            <div className="relative h-14 w-44">
              <Image
                src="/logo1.png"
                alt="Secretaría de Participación Ciudadana"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Nav centrado — desktop */}
          <div className="flex-1 flex items-center justify-center">
            {loggedIn && (
              <nav className="hidden lg:flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navLinkCls(pathname === item.href)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href={href} className={navLinkCls(false)}>
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </span>
                </Link>
              </nav>
            )}
          </div>

          {/* Derecha: usuario + acciones */}
          <div className="flex items-center gap-2 shrink-0">
            {loggedIn ? (
              <>
                {/* Badge de usuario — solo desktop */}
                {user?.nombre && (
                  <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-3 pr-2 py-1.5">
                    <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">
                      {user.nombre}
                    </span>
                    {badge && (
                      <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full", badge.cls)}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                )}
                {/* Solo badge en mobile cuando hay nombre */}
                {badge && user?.nombre && (
                  <span className={cn("sm:hidden text-[11px] font-bold px-2.5 py-1 rounded-full", badge.cls)}>
                    {badge.label}
                  </span>
                )}

                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-all duration-200 text-slate-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Ingresar
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* ── MOBILE NAV ── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-lg">
            {loggedIn && user?.nombre && (
              <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-slate-50 rounded-xl">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.nombre}</p>
                  {badge && (
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", badge.cls)}>
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>
            )}

            {loggedIn ? (
              <>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={mobileNavLinkCls(pathname === item.href)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={mobileNavLinkCls(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkCls(false)}
              >
                <LogIn className="w-4 h-4" />
                Ingresar
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Descripción */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md">
                  <span className="text-lg font-bold text-white">CD</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Ciudadanía Digital</p>
                  <p className="text-sm text-slate-500">San Miguel de Tucumán</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                Plataforma de Gestión para una Ciudadanía Activa y Participativa.
                Secretaría de Estado de Participación Ciudadana.
              </p>
            </div>

            {/* Enlaces rápidos */}
            {loggedIn && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-slate-500 hover:text-blue-600 transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={href}
                      className="text-sm text-slate-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Contacto */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>25 de Mayo 90</li>
                <li>San Miguel de Tucumán</li>
                <li>Tucumán, Argentina</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} José Farhat. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-6">
                <div className="relative h-12 w-40">
                  <Image src="/logo1.png" alt="SPC Tucumán" fill className="object-contain" />
                </div>
                <div className="relative h-12 w-40">
                  <Image src="/logo2.png" alt="Gobierno de Tucumán" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
