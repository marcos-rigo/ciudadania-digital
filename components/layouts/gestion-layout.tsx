"use client";

import React from "react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  PlayCircle,
  FileQuestion,
  FileText,
  Settings,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Bell,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sidebarItems = [
  { href: "/gestion", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gestion/usuarios", label: "Usuarios", icon: Users },
  { href: "/gestion/trayectos", label: "Trayectos", icon: BookOpen },
  { href: "/gestion/contenidos", label: "Contenidos", icon: PlayCircle },
  { href: "/gestion/encuestas", label: "Encuestas", icon: FileQuestion },
  { href: "/gestion/reportes", label: "Reportes", icon: FileText },
];

export function GestionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-[#030608] text-slate-200 border-r border-slate-800 lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6 bg-gradient-to-r from-cyan-500/5 to-violet-500/5">
          <Link href="/gestion" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/20 text-white font-bold text-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">Gestión</p>
              <p className="text-xs text-slate-500">Ciudadanía Digital</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/gestion" && pathname.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <Link href="/ciudadania-digital">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all duration-200">
              <ChevronLeft className="h-4 w-4" />
              Volver a la plataforma
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-[#030608] text-slate-200 border-r border-slate-800">
            <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6 bg-gradient-to-r from-cyan-500/5 to-violet-500/5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/20 text-white font-bold text-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-semibold text-sm">Gestión</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-cyan-400"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="space-y-1 p-4">
              {sidebarItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/gestion" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-slate-400 hover:bg-slate-800/50"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-800 p-4">
              <Link href="/ciudadania-digital" onClick={() => setSidebarOpen(false)}>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all duration-200">
                  <ChevronLeft className="h-4 w-4" />
                  Volver a la plataforma
                </div>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-slate-800/50 bg-[#050810]/95 backdrop-blur-xl px-4 sm:px-6">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent absolute top-0 left-0" />
          
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500/20 text-[10px] font-medium text-red-400 border border-red-500/30 flex items-center justify-center animate-pulse">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-slate-300 hover:text-cyan-400">
                <Avatar className="h-8 w-8 border border-slate-700">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-violet-500 text-white text-sm font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0d1220] border-slate-800">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-cyan-500/10 text-slate-300">
                <Link href="/gestion/configuracion">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem asChild className="cursor-pointer text-red-400 hover:bg-red-500/10">
                <Link href="/ciudadania-digital">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 bg-content-subtle">{children}</main>
      </div>
    </div>
  );
}