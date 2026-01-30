import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  PlayCircle,
  ClipboardCheck,
  Award,
  ArrowRight,
  CheckCircle,
  Settings,
} from "lucide-react";
import {
  currentMockUser,
  mockTrayectos,
  mockVideos,
  mockCertificados,
} from "@/lib/mock/ciudadania-data";

export default function MiPerfilPage() {
  const user = currentMockUser;

  // Calculate stats
  const trayectosIniciados = mockTrayectos.filter((t) =>
    user.trayectosIniciados.includes(t.id)
  );
  const trayectosCompletados = mockTrayectos.filter((t) =>
    user.trayectosCompletados.includes(t.id)
  );
  const userCertificados = mockCertificados.filter(
    (c) => c.usuarioId === user.id
  );

  return (
    <CiudadaniaLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <Card className="border-none shadow-sm mb-8 transition-smooth animate-fade-up reveal">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-sky-100 text-sky-600 text-2xl font-semibold">
                  {user.nombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {user.nombre}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Miembro desde{" "}
                  {new Date(user.fechaRegistro).toLocaleDateString("es-AR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <Button variant="outline" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Editar perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: BookOpen,
              label: "Trayectos iniciados",
              value: user.trayectosIniciados.length,
              color: "bg-blue-100 text-blue-600 dark:bg-blue-900/10 dark:text-blue-300",
            },
            {
              icon: CheckCircle,
              label: "Trayectos completados",
              value: user.trayectosCompletados.length,
              color: "bg-green-100 text-green-600 dark:bg-green-900/10 dark:text-green-300",
            },
            {
              icon: PlayCircle,
              label: "Videos vistos",
              value: user.videosVistos.length,
              color: "bg-red-100 text-red-600 dark:bg-red-900/10 dark:text-red-300",
            },
            {
              icon: Award,
              label: "Certificados",
              value: userCertificados.length,
              color: "bg-purple-100 text-purple-600 dark:bg-purple-900/10 dark:text-purple-300",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-4">
                <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trayectos en progreso */}
          <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-sky-600" />
                Mis Trayectos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trayectosIniciados.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Todavía no iniciaste ningún trayecto
                  </p>
                  <Link href="/trayectos">
                    <Button className="gap-2">
                      Explorar trayectos
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {trayectosIniciados.map((trayecto) => {
                    const isCompleted = user.trayectosCompletados.includes(
                      trayecto.id
                    );
                    const progress = isCompleted ? 100 : 65;

                    return (
                      <Link
                        key={trayecto.id}
                        href={`/trayectos/${trayecto.slug}`}
                        className="block"
                      >
                        <div className="p-4 rounded-lg border border-muted hover:border-sky-200 hover:bg-sky-50/50 dark:hover:bg-card/50 transition-colors">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-medium text-foreground">
                                {trayecto.titulo}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {trayecto.nivel} - {trayecto.duracion}
                              </p>
                            </div>
                            {isCompleted ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completado
                              </Badge>
                            ) : (
                              <Badge variant="secondary">En progreso</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium text-muted-foreground">
                              {progress}%
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificados */}
          <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Mis Certificados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userCertificados.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Completá un trayecto para obtener tu certificado
                  </p>
                  <Link href="/trayectos">
                    <Button variant="outline" className="gap-2 bg-transparent">
                      Ver trayectos
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userCertificados.map((cert) => (
                    <Link
                      key={cert.id}
                      href="/certificados"
                      className="block"
                    >
                      <div className="p-4 rounded-lg border border-muted hover:border-purple-200 hover:bg-purple-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                            <Award className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">
                              {cert.tituloTrayecto}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Emitido el{" "}
                              {new Date(cert.fechaEmision).toLocaleDateString(
                                "es-AR"
                              )}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Videos recientes */}
          <Card className="border-none shadow-sm lg:col-span-2 transition-smooth animate-fade-up reveal">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-red-600" />
                  Videos vistos recientemente
                </CardTitle>
                <Link href="/contenidos/videos">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Ver todos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {user.videosVistos.length === 0 ? (
                <div className="text-center py-8">
                  <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Todavía no viste ningún video
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockVideos
                    .filter((v) => user.videosVistos.includes(v.id))
                    .slice(0, 4)
                    .map((video) => (
                      <Link
                        key={video.id}
                        href={`/contenidos/videos/${video.id}`}
                        className="group"
                      >
                        <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mb-2 relative overflow-hidden">
                          <PlayCircle className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform" />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            {video.duracion}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-red-600 transition-colors">
                          {video.titulo}
                        </p>
                      </Link>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CiudadaniaLayout>
  );
}
