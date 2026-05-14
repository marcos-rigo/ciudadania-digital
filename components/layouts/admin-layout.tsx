"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  BarChart3,
  GraduationCap,
  Brain,
  FileText,
  Settings,
  Menu,
  LogOut,
  User,
  ChevronLeft,
  Bell,
  Sparkles,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/equipo", icon: LayoutDashboard },
  { title: "Programas", href: "/equipo/programas", icon: FolderOpen },
  { title: "Acciones", href: "/equipo/acciones", icon: Calendar },
  { title: "Tableros", href: "/equipo/tableros", icon: BarChart3 },
  { title: "Capacitación", href: "/equipo/capacitacion", icon: GraduationCap },
  { title: "IA", href: "/equipo/ia", icon: Brain },
  { title: "Reportes", href: "/equipo/reportes", icon: FileText },
  { title: "Configuración", href: "/equipo/configuracion", icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col bg-[#030608]">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-800 px-4 bg-gradient-to-r from-cyan-500/5 to-violet-500/5">
        <Link href="/equipo" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/20 text-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          {(!sidebarCollapsed || mobile) && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200">
                Panel de Gestión
              </span>
              <span className="text-xs text-slate-500">SPC Tucumán</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {(!sidebarCollapsed || mobile) && <span>{item.title}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Back to public site */}
      <div className="border-t border-slate-800 p-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors",
            sidebarCollapsed && !mobile && "justify-center"
          )}
        >
          <ChevronLeft className="h-5 w-5 shrink-0" />
          {(!sidebarCollapsed || mobile) && <span>Volver al sitio</span>}
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-800 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#030608] border-slate-800">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#050810]/95 backdrop-blur-xl">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
            {/* Mobile menu button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
            </Sheet>

            {/* Collapse button (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Colapsar menú</span>
            </Button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-medium text-red-400 border border-red-500/30 animate-pulse">
                3
              </span>
              <span className="sr-only">Notificaciones</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 text-slate-300 hover:text-cyan-400">
                  <Avatar className="h-8 w-8 border border-slate-700">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-violet-500 text-white text-sm font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">Admin</p>
                    <p className="text-xs text-slate-500">Administrador</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0d1220] border-slate-800">
                <DropdownMenuLabel className="text-slate-200">Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="cursor-pointer hover:bg-cyan-500/10 text-slate-300">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-cyan-500/10 text-slate-300">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem asChild className="cursor-pointer text-red-400 hover:bg-red-500/10">
                  <Link href="/equipo/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-content-subtle">{children}</main>
      </div>
    </div>
  )
}