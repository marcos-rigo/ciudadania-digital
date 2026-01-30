"use client";

import { useState } from "react";
import { GestionLayout } from "@/components/layouts/gestion-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  PlayCircle,
  Mic,
  Users,
} from "lucide-react";
import { mockTrayectos, mockVideos, mockPodcasts, mockUsers } from "@/lib/mock/ciudadania-data";

export default function GestionTrayectosPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTrayecto, setSelectedTrayecto] = useState<string | null>(null);

  const trayecto = selectedTrayecto
    ? mockTrayectos.find((t) => t.id === selectedTrayecto)
    : null;

  return (
    <GestionLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trayectos</h1>
            <p className="text-muted-foreground">
              Gestión de trayectos formativos
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo trayecto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total trayectos",
              value: mockTrayectos.length,
              icon: BookOpen,
              color: "text-blue-600 bg-blue-100 dark:bg-blue-900/10 dark:text-blue-300",
            },
            {
              label: "Activos",
              value: mockTrayectos.filter((t) => t.activo).length,
              icon: BookOpen,
              color: "text-green-600 bg-green-100 dark:bg-green-900/10 dark:text-green-300",
            },
            {
              label: "Videos asociados",
              value: mockVideos.length,
              icon: PlayCircle,
              color: "text-red-600 bg-red-100 dark:bg-red-900/10 dark:text-red-300",
            },
            {
              label: "Podcasts asociados",
              value: mockPodcasts.length,
              icon: Mic,
              color: "text-purple-600 bg-purple-100 dark:bg-purple-900/10 dark:text-purple-300",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trayecto</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Contenidos</TableHead>
                  <TableHead>Inscritos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTrayectos.map((trayecto) => {
                  const inscritos = mockUsers.filter((u) =>
                    u.trayectosIniciados.includes(trayecto.id)
                  ).length;

                  return (
                    <TableRow key={trayecto.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${trayecto.color}15` }}
                          >
                            <BookOpen
                              className="h-5 w-5"
                              style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {trayecto.titulo}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-[250px]">
                              {trayecto.descripcion}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: trayecto.color,
                            color: trayecto.color,
                          }}
                        >
                          {trayecto.nivel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {trayecto.duracion}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <PlayCircle className="h-4 w-4" />
                            {
                              mockVideos.filter(
                                (v) => v.trayectoId === trayecto.id
                              ).length
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <Mic className="h-4 w-4" />
                            {
                              mockPodcasts.filter(
                                (p) => p.trayectoId === trayecto.id
                              ).length
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {inscritos}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            trayecto.activo
                              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/10"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800/20 dark:text-gray-300 dark:hover:bg-gray-800/20"
                          }
                        >
                          {trayecto.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedTrayecto(trayecto.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalle
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear nuevo trayecto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" placeholder="Nombre del trayecto" />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción del trayecto"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nivel">Nivel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inicial">Inicial</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duracion">Duración estimada</Label>
                  <Input id="duracion" placeholder="Ej: 4 horas" />
                </div>
              </div>
              <div>
                <Label htmlFor="color">Color identificador</Label>
                <Input id="color" type="color" defaultValue="#3b82f6" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateOpen(false)}>
                Crear trayecto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail dialog */}
        <Dialog
          open={!!selectedTrayecto}
          onOpenChange={() => setSelectedTrayecto(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalle del trayecto</DialogTitle>
            </DialogHeader>
            {trayecto && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className="h-16 w-16 rounded-xl flex items-center justify-center"
                    style={{ ['--accent' as any]: trayecto.color, ['--accent-15' as any]: `${trayecto.color}15`, backgroundColor: 'var(--accent-15)' } as React.CSSProperties}
                  >
                    <BookOpen
                      className="h-8 w-8"
                      style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {trayecto.titulo}
                      </h3>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: trayecto.color,
                          color: trayecto.color,
                        }}
                      >
                        {trayecto.nivel}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {trayecto.descripcion}
                    </p>
                  </div>
                </div>

                {/* Modules */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    Módulos ({trayecto.modulos.length})
                  </h4>
                  <div className="space-y-2">
                    {trayecto.modulos.map((modulo, index) => (
                      <div
                        key={modulo.id}
                        className="p-3 rounded-lg border border-muted"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium"
                            style={{
                              backgroundColor: `${trayecto.color}15`,
                              color: trayecto.color,
                            }}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-foreground">
                              {modulo.titulo}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {modulo.videos.length} videos -{" "}
                              {modulo.podcasts.length} podcasts
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-muted">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {
                        mockUsers.filter((u) =>
                          u.trayectosIniciados.includes(trayecto.id)
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Inscritos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {
                        mockUsers.filter((u) =>
                          u.trayectosCompletados.includes(trayecto.id)
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Completados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {trayecto.contenidosTotal}
                    </p>
                    <p className="text-sm text-muted-foreground">Contenidos</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GestionLayout>
  );
}
