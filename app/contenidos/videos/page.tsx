"use client";

import { useState } from "react";
import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlayCircle,
  Clock,
  Search,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { mockVideos, mockTrayectos, currentMockUser } from "@/lib/mock/ciudadania-data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Loading = () => null;

export default function VideosPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [selectedTema, setSelectedTema] = useState<string>(searchParams.get("tema") || "todos");
  const [selectedTrayecto, setSelectedTrayecto] = useState<string>(searchParams.get("trayecto") || "todos");
  const [selectedNivel, setSelectedNivel] = useState<string>(searchParams.get("nivel") || "todos");

  // Get unique temas
  const temas = [...new Set(mockVideos.map((v) => v.tema).filter(Boolean))];

  // Filter videos
  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch =
      video.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTema = selectedTema === "todos" || video.tema === selectedTema;
    const matchesTrayecto =
      selectedTrayecto === "todos" || video.trayectoId === selectedTrayecto;
    const matchesNivel =
      selectedNivel === "todos" || video.nivel === selectedNivel;

    return matchesSearch && matchesTema && matchesTrayecto && matchesNivel;
  });

  return (
    <CiudadaniaLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-red-50 to-white dark:from-primary/10 dark:to-transparent py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center dark:bg-card dark:text-primary">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Videos Educativos
              </h1>
              <p className="text-muted-foreground">
                {mockVideos.length} videos disponibles
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Aprendé sobre ciudadanía digital con nuestros videos educativos.
            Cada video incluye material complementario y actividades prácticas.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedTema} onValueChange={setSelectedTema}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los temas</SelectItem>
                  {temas.map((tema) => (
                    <SelectItem key={tema} value={tema}>
                      {tema}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedTrayecto}
                onValueChange={setSelectedTrayecto}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trayecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los trayectos</SelectItem>
                  {mockTrayectos.map((trayecto) => (
                    <SelectItem key={trayecto.id} value={trayecto.id}>
                      {trayecto.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedNivel} onValueChange={setSelectedNivel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los niveles</SelectItem>
                  <SelectItem value="Inicial">Inicial</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Videos grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No se encontraron videos
              </h3>
              <p className="text-muted-foreground mb-4">
                Intentá ajustar los filtros de búsqueda
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTema("todos");
                  setSelectedTrayecto("todos");
                  setSelectedNivel("todos");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => {
                const isWatched = currentMockUser.videosVistos.includes(
                  video.id
                );
                const trayecto = mockTrayectos.find(
                  (t) => t.id === video.trayectoId
                );

                return (
                  <Link key={video.id} href={`/contenidos/videos/${video.id}`}>
                    <Card className="h-full border-none shadow-sm hover:shadow-lg transition-smooth animate-fade-up reveal overflow-hidden group">
                      {/* Thumbnail placeholder */}
                      <div className="relative aspect-video bg-gradient-to-br from-red-100 to-red-200 dark:from-primary/20 dark:to-primary/30 overflow-hidden">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="h-16 w-16 rounded-full bg-white/90 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform dark:bg-card dark:text-primary">
                              <PlayCircle className="h-8 w-8" />
                            </div>
                          </div>
                        )}
                          {isWatched && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-green-500 text-white hover:bg-green-500 dark:bg-green-400 dark:text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Visto
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duracion}
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: trayecto?.color,
                              color: trayecto?.color,
                            }}
                          >
                            {video.tema}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {video.nivel}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-primary transition-colors">
                          {video.titulo}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {video.descripcion}
                        </p>
                        {trayecto && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            {trayecto.titulo}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </CiudadaniaLayout>
  );
}

export const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);
