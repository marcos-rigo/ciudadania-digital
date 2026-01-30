"use client";

import { use } from "react";
import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  PlayCircle,
  Mic,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Circle,
  ListChecks,
  AlertCircle,
} from "lucide-react";
import {
  mockTrayectos,
  mockVideos,
  mockPodcasts,
  currentMockUser,
} from "@/lib/mock/ciudadania-data";

export default function TrayectoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const trayecto = mockTrayectos.find((t) => t.slug === slug);

  if (!trayecto) {
    return (
      <CiudadaniaLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Trayecto no encontrado
          </h1>
          <p className="text-muted-foreground mb-6">
            El trayecto que buscás no existe o fue eliminado.
          </p>
          <Link href="/trayectos">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a trayectos
            </Button>
          </Link>
        </div>
      </CiudadaniaLayout>
    );
  }

  const isStarted = currentMockUser.trayectosIniciados.includes(trayecto.id);
  const isCompleted = currentMockUser.trayectosCompletados.includes(
    trayecto.id
  );
  const progress = isCompleted ? 100 : isStarted ? 65 : 0;

  // Get related content
  const trayectoVideos = mockVideos.filter(
    (v) => v.trayectoId === trayecto.id
  );
  const trayectoPodcasts = mockPodcasts.filter(
    (p) => p.trayectoId === trayecto.id
  );

  return (
    <CiudadaniaLayout>
      {/* Header */}
      <section
        className="relative py-12 lg:py-16 animate-fade-up"
        style={{ ['--accent' as any]: trayecto.color, ['--accent-10' as any]: `${trayecto.color}10`, backgroundColor: 'var(--accent-10)' } as React.CSSProperties}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/trayectos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a trayectos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  style={{ ['--accent' as any]: trayecto.color, borderColor: 'var(--accent)', color: 'var(--accent)' } as React.CSSProperties}
                >
                  {trayecto.nivel}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/10">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completado
                  </Badge>
                )}
                {isStarted && !isCompleted && (
                    <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/10 dark:text-sky-300 dark:hover:bg-sky-900/10">
                    En progreso
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {trayecto.titulo}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {trayecto.descripcion}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {trayecto.duracion}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {trayecto.modulos.length} módulos
                </span>
                <span className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  {trayecto.contenidosTotal} contenidos
                </span>
              </div>
            </div>

            {/* Progress card */}
            <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-6">
                {isStarted ? (
                  <>
                    <h3 className="font-semibold text-foreground mb-4">
                      Tu progreso
                    </h3>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          {progress}% completado
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-6">
                      <p>
                        {Math.floor((trayectoVideos.length * progress) / 100)}{" "}
                        de {trayectoVideos.length} videos vistos
                      </p>
                      <p>
                        {Math.floor((trayectoPodcasts.length * progress) / 100)}{" "}
                        de {trayectoPodcasts.length} podcasts escuchados
                      </p>
                    </div>
                    {isCompleted ? (
                      <Link href="/certificados">
                        <Button
                          className="w-full gap-2"
                          style={{ ['--accent' as any]: trayecto.color, backgroundColor: 'var(--accent)' } as React.CSSProperties}
                        >
                          Ver certificado
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full gap-2"
                        style={{ ['--accent' as any]: trayecto.color, backgroundColor: 'var(--accent)' } as React.CSSProperties}
                      >
                        Continuar trayecto
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-foreground mb-2">
                      Comenzá este trayecto
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Registrá tu progreso y obtené tu certificado al completar
                      todos los contenidos.
                    </p>
                    <Button
                      className="w-full gap-2 text-white"
                      style={{ ['--accent' as any]: trayecto.color, backgroundColor: 'var(--accent)' } as React.CSSProperties}
                    >
                      Comenzar trayecto
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Modules */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                Módulos del trayecto
              </h2>

              {trayecto.modulos.map((modulo, index) => {
                const moduloVideos = mockVideos.filter((v) =>
                  modulo.videos.includes(v.id)
                );
                const moduloPodcasts = mockPodcasts.filter((p) =>
                  modulo.podcasts.includes(p.id)
                );
                const isModuloCompleted = index === 0 && isStarted;

                return (
                  <Card key={modulo.id} className="border-none shadow-sm transition-smooth animate-fade-up reveal">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ ['--accent' as any]: trayecto.color, ['--accent-15' as any]: `${trayecto.color}15`, backgroundColor: isModuloCompleted ? 'var(--accent)' : 'var(--accent-15)', color: isModuloCompleted ? 'white' : 'var(--accent)' } as React.CSSProperties}
                        >
                          {isModuloCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {modulo.titulo}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {modulo.descripcion}
                          </p>

                          {/* Module content */}
                          <div className="space-y-3">
                            {moduloVideos.map((video) => {
                              const isWatched =
                                currentMockUser.videosVistos.includes(video.id);
                              return (
                                <Link
                                  key={video.id}
                                  href={`/contenidos/videos/${video.id}`}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/40 transition-colors"
                                >
                                  {isWatched ? (
                                    <CheckCircle
                                      className="h-5 w-5 shrink-0"
                                      style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties}
                                    />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                                  )}
                                  <PlayCircle className="h-4 w-4 text-red-500 shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {video.titulo}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Video - {video.duracion}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}

                            {moduloPodcasts.map((podcast) => (
                              <Link
                                key={podcast.id}
                                href="/contenidos/podcast"
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/40 transition-colors"
                              >
                                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                                <Mic className="h-4 w-4 text-purple-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {podcast.titulo}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Podcast - {podcast.duracion}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Evaluation */}
              <Card className="border-none shadow-sm border-l-4 transition-smooth animate-fade-up reveal" style={{ ['--accent' as any]: trayecto.color, borderLeftColor: 'var(--accent)' } as React.CSSProperties}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ ['--accent' as any]: trayecto.color, ['--accent-15' as any]: `${trayecto.color}15`, backgroundColor: 'var(--accent-15)' } as React.CSSProperties}
                    >
                      <ListChecks
                        className="h-5 w-5"
                        style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        Evaluación final
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Completá la evaluación para obtener tu certificado de
                        Ciudadano/a Digital.
                      </p>
                      <Link href={`/evaluaciones?trayecto=${trayecto.id}`}>
                        <Button
                          variant="outline"
                          className="gap-2 bg-transparent"
                          style={{ ['--accent' as any]: trayecto.color, borderColor: 'var(--accent)', color: 'var(--accent)' } as React.CSSProperties}
                        >
                          Ir a la evaluación
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Requirements */}
              <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Requisitos
                  </h3>
                  <ul className="space-y-2">
                    {trayecto.requisitos.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties}
                        />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Related content */}
              <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Contenidos incluidos
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <PlayCircle className="h-4 w-4 text-red-500" />
                        Videos educativos
                      </span>
                      <span className="font-medium">
                        {trayectoVideos.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Mic className="h-4 w-4 text-purple-500" />
                        Episodios de podcast
                      </span>
                      <span className="font-medium">
                        {trayectoPodcasts.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <ListChecks className="h-4 w-4 text-green-500" />
                        Evaluación final
                      </span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </CiudadaniaLayout>
  );
}
