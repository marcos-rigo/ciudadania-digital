"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  Video,
  Award,
  TrendingUp,
  Users,
  Calendar,
  ChevronRight,
  Lock,
  Star,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const cursos = [
  {
    id: "1",
    titulo: "Fundamentos de Gestión de Datos Territoriales",
    descripcion: "Aprende los conceptos básicos de la gestión de datos georreferenciados y su aplicación en políticas públicas.",
    duracion: "4 horas",
    modulos: 8,
    modulosCompletados: 8,
    estado: "completado",
    categoria: "Datos",
    nivel: "Básico",
    certificado: true,
    imagen: "/placeholder.svg",
  },
  {
    id: "2",
    titulo: "Uso del Sistema de Información Territorial",
                  <div>
                    <p className="text-2xl font-bold">{cursosCompletados}</p>
                    <p className="text-sm text-muted-foreground">Cursos completados</p>
                  </div>
    duracion: "6 horas",
    modulos: 12,
    modulosCompletados: 7,
    estado: "en-progreso",
    categoria: "Herramientas",
    nivel: "Intermedio",
    certificado: true,
    imagen: "/placeholder.svg",
  },
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/10">
                    <Play className="h-6 w-6 text-blue-600" />
                  </div>
  {
    id: "3",
    titulo: "Elaboración de Informes de Impacto",
    descripcion: "Técnicas para elaborar informes efectivos que comuniquen el impacto de las acciones ciudadanas.",
    duracion: "3 horas",
    modulos: 6,
    modulosCompletados: 0,
    estado: "pendiente",
    categoria: "Comunicación",
    nivel: "Intermedio",
    certificado: true,
    imagen: "/placeholder.svg",
  },
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/10">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
  {
    id: "4",
    titulo: "Asistente IA para Análisis de Datos",
    descripcion: "Aprende a utilizar el asistente de IA para generar análisis y reportes automatizados.",
    duracion: "2 horas",
    modulos: 4,
    modulosCompletados: 0,
    estado: "bloqueado",
    categoria: "IA",
    nivel: "Avanzado",
    certificado: true,
    imagen: "/placeholder.svg",
  },
                  <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/10">
                    <TrendingUp className="h-6 w-6 text-amber-600" />
                  </div>
  {
    id: "5",
    titulo: "Coordinación de Operativos en Territorio",
    descripcion: "Metodologías para planificar y coordinar operativos de participación ciudadana en el territorio.",
    duracion: "5 horas",
    modulos: 10,
    modulosCompletados: 0,
    estado: "pendiente",
    categoria: "Gestión",
    nivel: "Intermedio",
    certificado: true,
    imagen: "/placeholder.svg",
  },
];

const recursos = [
  { id: "1", titulo: "Manual de Usuario - SIT v2.0", tipo: "PDF", tamaño: "2.4 MB", fecha: "2025-01-15" },
  { id: "2", titulo: "Guía Rápida - Registro de Acciones", tipo: "PDF", tamaño: "850 KB", fecha: "2025-01-10" },
  { id: "3", titulo: "Plantilla de Informe Mensual", tipo: "DOCX", tamaño: "125 KB", fecha: "2025-01-08" },
  { id: "4", titulo: "Video Tutorial - Dashboard de Métricas", tipo: "Video", tamaño: "45 min", fecha: "2025-01-05" },
  { id: "5", titulo: "FAQ - Preguntas Frecuentes", tipo: "PDF", tamaño: "1.2 MB", fecha: "2024-12-20" },
];

function getEstadoBadge(estado: string) {
  switch (estado) {
    case "completado":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completado</Badge>;
    case "en-progreso":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
    case "pendiente":
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pendiente</Badge>;
    case "bloqueado":
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Bloqueado</Badge>;
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
}

function getNivelBadge(nivel: string) {
  switch (nivel) {
    case "Básico":
      return <Badge variant="outline" className="border-green-300 text-green-700">Básico</Badge>;
    case "Intermedio":
      return <Badge variant="outline" className="border-blue-300 text-blue-700">Intermedio</Badge>;
    case "Avanzado":
      return <Badge variant="outline" className="border-purple-300 text-purple-700">Avanzado</Badge>;
    default:
      return <Badge variant="outline">{nivel}</Badge>;
  }
}

function Loading() {
  return null;
}

function CapacitacionContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const searchParams = useSearchParams();

  const cursosFiltrados = cursos.filter((curso) => {
    const matchSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === "todos" || curso.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const cursosCompletados = cursos.filter((c) => c.estado === "completado").length;
  const cursosEnProgreso = cursos.filter((c) => c.estado === "en-progreso").length;
  const totalModulos = cursos.reduce((acc, c) => acc + c.modulos, 0);
  const modulosCompletados = cursos.reduce((acc, c) => acc + c.modulosCompletados, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Capacitación</h1>
            <p className="text-muted-foreground mt-1">
              Desarrolla tus habilidades y conocimientos para gestionar mejor las acciones ciudadanas
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{cursosCompletados}</p>
                    <p className="text-sm text-muted-foreground">Cursos completados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Play className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{cursosEnProgreso}</p>
                    <p className="text-sm text-muted-foreground">En progreso</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{cursosCompletados}</p>
                    <p className="text-sm text-muted-foreground">Certificados obtenidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-amber-100">
                    <TrendingUp className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round((modulosCompletados / totalModulos) * 100)}%</p>
                    <p className="text-sm text-muted-foreground">Progreso general</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="cursos" className="space-y-6">
            <TabsList>
              <TabsTrigger value="cursos" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Cursos
              </TabsTrigger>
              <TabsTrigger value="recursos" className="gap-2">
                <FileText className="h-4 w-4" />
                Recursos
              </TabsTrigger>
              <TabsTrigger value="certificados" className="gap-2">
                <Award className="h-4 w-4" />
                Certificados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cursos" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {["todos", "Datos", "Herramientas", "Comunicación", "IA", "Gestión"].map((cat) => (
                    <Button
                      key={cat}
                      variant={categoriaFiltro === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoriaFiltro(cat)}
                    >
                      {cat === "todos" ? "Todos" : cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Course in progress highlight */}
              {cursos.find((c) => c.estado === "en-progreso") && (
                <Card className="border-blue-200 bg-blue-50/50 dark:bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Play className="h-5 w-5 text-blue-600" />
                      Continuar aprendiendo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const curso = cursos.find((c) => c.estado === "en-progreso");
                      if (!curso) return null;
                      const progreso = (curso.modulosCompletados / curso.modulos) * 100;
                      return (
                        <div className="flex items-center gap-6">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{curso.titulo}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{curso.descripcion}</p>
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progreso: {curso.modulosCompletados}/{curso.modulos} módulos</span>
                                <span className="font-medium">{Math.round(progreso)}%</span>
                              </div>
                              <Progress value={progreso} className="h-2" />
                            </div>
                          </div>
                          <Button className="gap-2">
                            <Play className="h-4 w-4" />
                            Continuar
                          </Button>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Courses grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursosFiltrados.map((curso) => {
                  const progreso = (curso.modulosCompletados / curso.modulos) * 100;
                  const bloqueado = curso.estado === "bloqueado";

                  return (
                    <Card key={curso.id} className={`overflow-hidden ${bloqueado ? "opacity-75" : ""}`}>
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        {bloqueado ? (
                          <Lock className="h-12 w-12 text-muted-foreground" />
                        ) : (
                          <BookOpen className="h-12 w-12 text-primary/60" />
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          {getEstadoBadge(curso.estado)}
                          {getNivelBadge(curso.nivel)}
                        </div>
                        <h3 className="font-semibold text-foreground line-clamp-2">{curso.titulo}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{curso.descripcion}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {curso.duracion}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {curso.modulos} módulos
                          </span>
                        </div>
                        {curso.estado !== "completado" && curso.estado !== "bloqueado" && (
                          <div className="mt-4">
                            <Progress value={progreso} className="h-1.5" />
                          </div>
                        )}
                        <Button
                          className="w-full mt-4 gap-2"
                          variant={bloqueado ? "outline" : curso.estado === "completado" ? "secondary" : "default"}
                          disabled={bloqueado}
                        >
                          {bloqueado ? (
                            <>
                              <Lock className="h-4 w-4" />
                              Completar prerrequisitos
                            </>
                          ) : curso.estado === "completado" ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Ver certificado
                            </>
                          ) : curso.estado === "en-progreso" ? (
                            <>
                              <Play className="h-4 w-4" />
                              Continuar
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Comenzar
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="recursos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biblioteca de Recursos</CardTitle>
                  <CardDescription>Documentos, guías y materiales de apoyo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recursos.map((recurso) => (
                      <div
                        key={recurso.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-muted">
                            {recurso.tipo === "Video" ? (
                              <Video className="h-5 w-5 text-primary" />
                            ) : (
                              <FileText className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{recurso.titulo}</p>
                            <p className="text-sm text-muted-foreground">
                              {recurso.tipo} • {recurso.tamaño} • {recurso.fecha}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Descargar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificados" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Certificados</CardTitle>
                  <CardDescription>Certificaciones obtenidas por cursos completados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cursos
                      .filter((c) => c.estado === "completado" && c.certificado)
                      .map((curso) => (
                        <div
                          key={curso.id}
                          className="p-6 rounded-lg border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-primary/10">
                                <Award className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{curso.titulo}</p>
                                <p className="text-sm text-muted-foreground">Completado el 15/01/2025</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Ver certificado
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Descargar PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    );
  }

  export default function CapacitacionPage() {
    return (
      <Suspense fallback={<Loading />}>
        <CapacitacionContent />
      </Suspense>
    );
  }

