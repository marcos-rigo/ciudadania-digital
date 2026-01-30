"use client";

import { use, useState } from "react";
import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import { mockVideos, mockTrayectos, currentMockUser } from "@/lib/mock/ciudadania-data";

export default function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const video = mockVideos.find((v) => v.id === id);
  const [isMarkedAsWatched, setIsMarkedAsWatched] = useState(
    currentMockUser.videosVistos.includes(id)
  );

  if (!video) {
    return (
      <CiudadaniaLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Video no encontrado
          </h1>
          <p className="text-muted-foreground mb-6">
            El video que buscás no existe o fue eliminado.
          </p>
          <Link href="/contenidos/videos">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a videos
            </Button>
          </Link>
        </div>
      </CiudadaniaLayout>
    );
  }

  const trayecto = mockTrayectos.find((t) => t.id === video.trayectoId);

  // Get next and previous videos from same trayecto
  const trayectoVideos = mockVideos
    .filter((v) => v.trayectoId === video.trayectoId)
    .sort((a, b) => a.orden - b.orden);
  const currentIndex = trayectoVideos.findIndex((v) => v.id === video.id);
  const prevVideo = currentIndex > 0 ? trayectoVideos[currentIndex - 1] : null;
  const nextVideo =
    currentIndex < trayectoVideos.length - 1
      ? trayectoVideos[currentIndex + 1]
      : null;

  const handleMarkAsWatched = () => {
    setIsMarkedAsWatched(true);
  };

  return (
    <CiudadaniaLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/contenidos/videos"
            className="hover:text-foreground transition-colors"
          >
            Videos
          </Link>
          <span>/</span>
          {trayecto && (
            <>
              <Link
                href={`/trayectos/${trayecto.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {trayecto.titulo}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate">{video.titulo}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  style={{
                    borderColor: trayecto?.color,
                    color: trayecto?.color,
                  }}
                >
                  {video.tema}
                </Badge>
                <Badge variant="secondary">{video.nivel}</Badge>
                {isMarkedAsWatched && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Visto
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {video.titulo}
              </h1>
              <p className="text-muted-foreground mb-4">{video.descripcion}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {video.duracion}
                </span>
                {trayecto && (
                  <Link
                    href={`/trayectos/${trayecto.slug}`}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    {trayecto.titulo}
                  </Link>
                )}
              </div>
            </div>

            {/* Educational text */}
            <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-6">
                <h2 className="font-semibold text-foreground mb-3">
                  Material educativo
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {video.textoEducativo}
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              {!isMarkedAsWatched && (
                <Button
                  onClick={handleMarkAsWatched}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como visto
                </Button>
              )}
              {trayecto && (
                <Link href={`/evaluaciones?trayecto=${trayecto.id}`}>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    Ir a la evaluación
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-muted">
              {prevVideo ? (
                <Link href={`/contenidos/videos/${prevVideo.id}`}>
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextVideo ? (
                <Link href={`/contenidos/videos/${nextVideo.id}`}>
                  <Button variant="ghost" className="gap-2">
                    <span className="hidden sm:inline">Siguiente</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trayecto videos */}
            {trayecto && (
              <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">
                    Videos del trayecto
                  </h3>
                  <div className="space-y-2">
                    {trayectoVideos.map((v) => {
                      const isWatched =
                        currentMockUser.videosVistos.includes(v.id) ||
                        (v.id === video.id && isMarkedAsWatched);
                      const isCurrent = v.id === video.id;

                      return (
                        <Link
                          key={v.id}
                          href={`/contenidos/videos/${v.id}`}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                            isCurrent
                              ? "bg-sky-50 border border-sky-200 dark:bg-card dark:border-border"
                              : "hover:bg-muted dark:hover:bg-muted/30"
                          }`}
                        >
                          {isWatched ? (
                            <CheckCircle
                              className="h-4 w-4 flex-shrink-0"
                              style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties}
                            />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm truncate ${isCurrent ? "font-medium text-foreground" : "text-muted-foreground"}`}
                            >
                              {v.titulo}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {v.duracion}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related info */}
            <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-4">
                  Sobre este contenido
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tema</span>
                    <span className="font-medium">{video.tema}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nivel</span>
                    <span className="font-medium">{video.nivel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración</span>
                    <span className="font-medium">{video.duracion}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CiudadaniaLayout>
  );
}
