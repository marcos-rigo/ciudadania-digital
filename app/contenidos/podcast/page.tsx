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
import { Mic, Clock, Search, Users, BookOpen, Play, X } from "lucide-react";
import { mockPodcasts, mockTrayectos } from "@/lib/mock/ciudadania-data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function PodcastPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTema, setSelectedTema] = useState<string>("todos");
  const [selectedTrayecto, setSelectedTrayecto] = useState<string>("todos");
  const [selectedPodcast, setSelectedPodcast] = useState<string | null>(null);

  // Get unique temas
  const temas = [...new Set(mockPodcasts.map((p) => p.tema).filter(Boolean))];

  // Filter podcasts
  const filteredPodcasts = mockPodcasts.filter((podcast) => {
    const matchesSearch =
      podcast.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTema =
      selectedTema === "todos" || podcast.tema === selectedTema;
    const matchesTrayecto =
      selectedTrayecto === "todos" || podcast.trayectoId === selectedTrayecto;

    return matchesSearch && matchesTema && matchesTrayecto;
  });

  return (
    <CiudadaniaLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-primary/10 dark:to-transparent py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-card dark:text-primary">
              <Mic className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Podcast
              </h1>
              <p className="text-muted-foreground">
                {mockPodcasts.length} episodios disponibles
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Escuchá conversaciones con expertos, testimonios y reflexiones sobre
            ciudadanía digital. Ideal para aprender mientras viajás o hacés
            otras actividades.
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
                placeholder="Buscar episodios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedTema} onValueChange={setSelectedTema}>
                <SelectTrigger className="w-40">
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
            </div>
          </div>
        </div>
      </section>

      {/* Podcasts list */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredPodcasts.length === 0 ? (
            <div className="text-center py-12">
              <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No se encontraron episodios
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
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPodcasts.map((podcast) => {
                const trayecto = mockTrayectos.find(
                  (t) => t.id === podcast.trayectoId
                );

                return (
                  <Card
                    key={podcast.id}
                    className="border-none shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Thumbnail */}
                        <div className="shrink-0">
                            {podcast.thumbnail ? (
                            <img
                              src={podcast.thumbnail}
                              alt={podcast.titulo}
                              className="h-32 w-32 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center dark:from-primary/20 dark:to-primary/30">
                              <Mic className="h-12 w-12 text-purple-600 dark:text-primary" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="text-purple-600 border-purple-300 dark:text-primary dark:border-primary/40"
                            >
                              {podcast.tema}
                            </Badge>
                            {trayecto && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{
                                  backgroundColor: `${trayecto.color}15`,
                                  color: trayecto.color,
                                }}
                              >
                                <BookOpen className="h-3 w-3 mr-1" />
                                {trayecto.titulo}
                              </Badge>
                            )}
                          </div>

                          <h2 className="text-xl font-semibold text-foreground mb-2">
                            {podcast.titulo}
                          </h2>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {podcast.descripcion}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {podcast.duracion}
                            </span>
                            {podcast.invitados && podcast.invitados.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {podcast.invitados.join(", ")}
                              </span>
                            )}
                          </div>

                          {/* Player placeholder */}
                          <div className="flex flex-wrap gap-3">
                            <Button 
                              onClick={() => setSelectedPodcast(podcast.id)}
                              className="gap-2 bg-purple-600 hover:bg-purple-700 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                            >
                              <Play className="h-4 w-4" />
                              Reproducir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Podcast Player Modal */}
      {selectedPodcast && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-foreground">
                  {mockPodcasts.find(p => p.id === selectedPodcast)?.titulo}
                </h3>
                <button
                  onClick={() => setSelectedPodcast(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Spotify Embed */}
              <div className="mb-6">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src={`https://open.spotify.com/embed/episode/${mockPodcasts.find(p => p.id === selectedPodcast)?.spotifyEpisodeId}?utm_source=generator`}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  title="Spotify Player"
                />
              </div>

              <p className="text-muted-foreground mb-6">
                {mockPodcasts.find(p => p.id === selectedPodcast)?.descripcion}
              </p>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedPodcast(null)}
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </CiudadaniaLayout>
  );
}

export function Loading() {
  return null;
}
