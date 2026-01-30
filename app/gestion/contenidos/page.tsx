"use client";

import { useState } from "react";
import { GestionLayout } from "@/components/layouts/gestion-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  PlayCircle,
  Mic,
  Clock,
  ExternalLink,
} from "lucide-react";
import { mockVideos, mockPodcasts, mockTrayectos } from "@/lib/mock/ciudadania-data";

export default function GestionContenidosPage() {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isPodcastDialogOpen, setIsPodcastDialogOpen] = useState(false);

  return (
    <GestionLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contenidos</h1>
          <p className="text-muted-foreground">
            Gestión de videos y podcasts educativos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Videos totales",
              value: mockVideos.length,
              icon: PlayCircle,
              color: "text-red-600 bg-red-100 dark:bg-red-900/10 dark:text-red-300",
            },
            {
              label: "Podcasts totales",
              value: mockPodcasts.length,
              icon: Mic,
              color: "text-purple-600 bg-purple-100 dark:bg-purple-900/10 dark:text-purple-300",
            },
            {
              label: "Duración total videos",
              value: "3h 45m",
              icon: Clock,
              color: "text-blue-600 bg-blue-100 dark:bg-blue-900/10 dark:text-blue-300",
            },
            {
              label: "Duración total podcasts",
              value: "4h 20m",
              icon: Clock,
              color: "text-green-600 bg-green-100 dark:bg-green-900/10 dark:text-green-300",
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

        {/* Content tabs */}
        <Tabs defaultValue="videos" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="videos" className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Videos ({mockVideos.length})
              </TabsTrigger>
              <TabsTrigger value="podcasts" className="gap-2">
                <Mic className="h-4 w-4" />
                Podcasts ({mockPodcasts.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Videos tab */}
          <TabsContent value="videos">
            <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-4">
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => setIsVideoDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo video
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Video</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead>Trayecto</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVideos.map((video) => {
                      const trayecto = mockTrayectos.find(
                        (t) => t.id === video.trayectoId
                      );

                      return (
                        <TableRow key={video.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/10 dark:text-red-300 flex items-center justify-center">
                                <PlayCircle className="h-5 w-5" />
                              </div>
                              <div className="max-w-[250px]">
                                <p className="font-medium text-foreground truncate">
                                  {video.titulo}
                                </p>
                                <a
                                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                  YouTube
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{video.tema}</Badge>
                          </TableCell>
                          <TableCell>
                            {trayecto && (
                              <Badge
                                variant="outline"
                                style={{
                                  borderColor: trayecto.color,
                                  color: trayecto.color,
                                }}
                              >
                                {trayecto.titulo}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {video.duracion}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{video.nivel}</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
          </TabsContent>

          {/* Podcasts tab */}
          <TabsContent value="podcasts">
            <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-4">
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => setIsPodcastDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo podcast
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Podcast</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead>Trayecto</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Invitados</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPodcasts.map((podcast) => {
                      const trayecto = mockTrayectos.find(
                        (t) => t.id === podcast.trayectoId
                      );

                      return (
                        <TableRow key={podcast.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                <Mic className="h-5 w-5" />
                              </div>
                              <div className="max-w-[250px]">
                                <p className="font-medium text-foreground truncate">
                                  {podcast.titulo}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{podcast.tema}</Badge>
                          </TableCell>
                          <TableCell>
                            {trayecto && (
                              <Badge
                                variant="outline"
                                style={{
                                  borderColor: trayecto.color,
                                  color: trayecto.color,
                                }}
                              >
                                {trayecto.titulo}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {podcast.duracion}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {podcast.invitados.length > 0
                                ? podcast.invitados.join(", ")
                                : "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
          </TabsContent>
        </Tabs>

        {/* Video dialog */}
        <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar nuevo video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="v-titulo">Título</Label>
                <Input id="v-titulo" placeholder="Título del video" />
              </div>
              <div>
                <Label htmlFor="v-descripcion">Descripción</Label>
                <Textarea
                  id="v-descripcion"
                  placeholder="Descripción del video"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="v-youtube">ID de YouTube</Label>
                <Input id="v-youtube" placeholder="Ej: dQw4w9WgXcQ" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="v-trayecto">Trayecto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTrayectos.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.titulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="v-duracion">Duración</Label>
                  <Input id="v-duracion" placeholder="Ej: 15:00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="v-tema">Tema</Label>
                  <Input id="v-tema" placeholder="Ej: Fundamentos" />
                </div>
                <div>
                  <Label htmlFor="v-nivel">Nivel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inicial">Inicial</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsVideoDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setIsVideoDialogOpen(false)}>
                Agregar video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Podcast dialog */}
        <Dialog
          open={isPodcastDialogOpen}
          onOpenChange={setIsPodcastDialogOpen}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar nuevo podcast</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="p-titulo">Título</Label>
                <Input id="p-titulo" placeholder="Título del episodio" />
              </div>
              <div>
                <Label htmlFor="p-descripcion">Descripción</Label>
                <Textarea
                  id="p-descripcion"
                  placeholder="Descripción del episodio"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-spotify">ID de Spotify</Label>
                  <Input id="p-spotify" placeholder="ID del episodio" />
                </div>
                <div>
                  <Label htmlFor="p-youtube">ID de YouTube</Label>
                  <Input id="p-youtube" placeholder="ID del video" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-trayecto">Trayecto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTrayectos.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.titulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="p-duracion">Duración</Label>
                  <Input id="p-duracion" placeholder="Ej: 30:00" />
                </div>
              </div>
              <div>
                <Label htmlFor="p-invitados">Invitados</Label>
                <Input
                  id="p-invitados"
                  placeholder="Nombres separados por coma"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPodcastDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setIsPodcastDialogOpen(false)}>
                Agregar podcast
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </GestionLayout>
  );
}
