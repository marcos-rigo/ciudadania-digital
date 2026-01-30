"use client";

import React from "react"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  {
    href: "/gestion",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/gestion/usuarios",
    label: "Usuarios",
    icon: Users,
  },
  {
    href: "/gestion/trayectos",
    label: "Trayectos",
    icon: BookOpen,
  },
  {
    href: "/gestion/contenidos",
    label: "Contenidos",
    icon: PlayCircle,
  },
  {
    href: "/gestion/encuestas",
    label: "Encuestas",
    icon: FileQuestion,
  },
  {
    href: "/gestion/reportes",
    label: "Reportes",
    icon: FileText,
  },
];

export function GestionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6 bg-gradient-to-r from-sidebar-primary/10 to-sidebar-accent/10">
          <Link href="/gestion" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-accent glow text-sidebar-primary-foreground font-bold text-sm">
              CD
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">Gestión</p>
              <p className="text-xs text-sidebar-foreground/60">
                Ciudadanía Digital
              </p>
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
                      ? "bg-sidebar-accent text-sidebar-accent-foreground glow-accent shadow-glow-accent"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Link href="/ciudadania-digital">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200">
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
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6 bg-gradient-to-r from-sidebar-primary/10 to-sidebar-accent/10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-accent glow text-sidebar-primary-foreground font-bold text-sm">
                  CD
                </div>
                <span className="font-semibold text-sm">Gestión</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-sidebar-foreground"
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
                          ? "bg-sidebar-accent text-sidebar-accent-foreground glow-accent"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-sidebar-border p-4">
              <Link href="/ciudadania-digital" onClick={() => setSidebarOpen(false)}>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200">
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
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 backdrop-blur px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative glow">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center animate-pulse">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8 glow">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10">
                <Link href="/gestion/configuracion">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/ciudadania-digital">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
