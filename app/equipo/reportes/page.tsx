"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileImage,
  Loader2,
  Eye,
  Trash2,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  Map,
  Users,
} from "lucide-react";

const reportesGenerados = [
  {
    id: "1",
    nombre: "Informe Mensual - Enero 2025",
    tipo: "Mensual",
    formato: "PDF",
    fecha: "2025-01-20",
    estado: "completado",
    tamaño: "2.4 MB",
  },
  {
    id: "2",
    nombre: "Análisis Territorial Q4 2024",
    tipo: "Trimestral",
    formato: "PDF",
    fecha: "2025-01-15",
    estado: "completado",
    tamaño: "5.1 MB",
  },
  {
    id: "3",
    nombre: "Exportación de Acciones - Enero",
    tipo: "Datos",
    formato: "Excel",
    fecha: "2025-01-18",
    estado: "completado",
    tamaño: "1.8 MB",
  },
  {
    id: "4",
    nombre: "Informe de Impacto 2024",
    tipo: "Anual",
    formato: "PDF",
    fecha: "2025-01-10",
    estado: "procesando",
    tamaño: "-",
  },
  {
    id: "5",
    nombre: "Métricas de Participación",
    tipo: "Semanal",
    formato: "PDF",
    fecha: "2025-01-19",
    estado: "error",
    tamaño: "-",
  },
];

const plantillasReportes = [
  {
    id: "1",
    nombre: "Informe Mensual de Actividades",
    descripcion: "Resumen completo de acciones, métricas y resultados del mes",
    icon: FileText,
    campos: ["Mes", "Año", "Programas a incluir"],
  },
  {
    id: "2",
    nombre: "Análisis Territorial",
    descripcion: "Distribución geográfica de acciones y cobertura",
    icon: Map,
    campos: ["Período", "Departamentos", "Tipo de visualización"],
  },
  {
    id: "3",
    nombre: "Reporte de Participación Ciudadana",
    descripcion: "Estadísticas de beneficiarios y participación",
    icon: Users,
    campos: ["Período", "Programas", "Segmentación"],
  },
  {
    id: "4",
    nombre: "Dashboard Ejecutivo",
    descripcion: "KPIs principales y métricas clave para presentaciones",
    icon: BarChart3,
    campos: ["Período", "Comparativa"],
  },
  {
    id: "5",
    nombre: "Exportación de Datos",
    descripcion: "Exportar datos crudos en formato Excel o CSV",
    icon: FileSpreadsheet,
    campos: ["Entidad", "Período", "Campos a exportar"],
  },
  {
    id: "6",
    nombre: "Informe de Impacto",
    descripcion: "Evaluación del impacto de programas y acciones",
    icon: TrendingUp,
    campos: ["Programa", "Período", "Indicadores"],
  },
];

function getEstadoBadge(estado: string) {
  switch (estado) {
    case "completado":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completado
        </Badge>
      );
    case "procesando":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Procesando
        </Badge>
      );
    case "error":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 gap-1">
          <AlertCircle className="h-3 w-3" />
          Error
        </Badge>
      );
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
}

function getFormatoIcon(formato: string) {
  switch (formato) {
    case "PDF":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "Excel":
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    case "Imagen":
      return <FileImage className="h-5 w-5 text-blue-500" />;
    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
}

export default function ReportesPage() {
  const [selectedPlantilla, setSelectedPlantilla] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerarReporte = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setSelectedPlantilla(null);
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
            <p className="text-muted-foreground mt-1">
              Genera y descarga informes personalizados
            </p>
          </div>
        </div>

        <Tabs defaultValue="generar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="generar" className="gap-2">
              <Plus className="h-4 w-4" />
              Generar Reporte
            </TabsTrigger>
            <TabsTrigger value="historial" className="gap-2">
              <Clock className="h-4 w-4" />
              Historial
            </TabsTrigger>
            <TabsTrigger value="programados" className="gap-2">
              <Calendar className="h-4 w-4" />
              Programados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generar" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantillasReportes.map((plantilla) => (
                <Card
                  key={plantilla.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPlantilla === plantilla.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedPlantilla(plantilla.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <plantilla.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{plantilla.nombre}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {plantilla.descripcion}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedPlantilla && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Configurar Reporte:{" "}
                    {plantillasReportes.find((p) => p.id === selectedPlantilla)?.nombre}
                  </CardTitle>
                  <CardDescription>
                    Completa los campos para generar el reporte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Período</Label>
                      <Select defaultValue="enero-2025">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enero-2025">Enero 2025</SelectItem>
                          <SelectItem value="q4-2024">Q4 2024</SelectItem>
                          <SelectItem value="2024">Año 2024</SelectItem>
                          <SelectItem value="personalizado">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Formato de salida</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Programas a incluir</Label>
                      <Select defaultValue="todos">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar programas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los programas</SelectItem>
                          <SelectItem value="territorio">Tucumán en Territorio</SelectItem>
                          <SelectItem value="participacion">Participación Comunitaria</SelectItem>
                          <SelectItem value="seguridad">Seguridad Ciudadana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <Button
                      onClick={handleGenerarReporte}
                      disabled={isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          Generar Reporte
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedPlantilla(null)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="historial" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reportes Generados</CardTitle>
                    <CardDescription>Historial de reportes y exportaciones</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Input placeholder="Buscar reportes..." className="w-64" />
                    </div>
                    <Select defaultValue="todos">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrar por tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="mensual">Mensual</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="datos">Datos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportesGenerados.map((reporte) => (
                    <div
                      key={reporte.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-muted">
                          {getFormatoIcon(reporte.formato)}
                        </div>
                        <div>
                          <p className="font-medium">{reporte.nombre}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>{reporte.tipo}</span>
                            <span>•</span>
                            <span>{reporte.fecha}</span>
                            {reporte.tamaño !== "-" && (
                              <>
                                <span>•</span>
                                <span>{reporte.tamaño}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getEstadoBadge(reporte.estado)}
                        {reporte.estado === "completado" && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {reporte.estado === "error" && (
                          <Button variant="ghost" size="icon">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programados" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reportes Programados</CardTitle>
                    <CardDescription>
                      Configura la generación automática de reportes
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Reporte Programado
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Informe Mensual Automático</p>
                          <p className="text-sm text-muted-foreground">
                            Primer día de cada mes • PDF • Todos los programas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Activo
                        </Badge>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Exportación Semanal de Datos</p>
                          <p className="text-sm text-muted-foreground">
                            Todos los lunes • Excel • Acciones de la semana
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Activo
                        </Badge>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
