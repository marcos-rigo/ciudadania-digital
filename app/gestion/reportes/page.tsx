"use client";

import { GestionLayout } from "@/components/layouts/gestion-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Users,
  BookOpen,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { mockEstadisticas } from "@/lib/mock/ciudadania-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LineChart,
              {
              {
              {
              {
            ].map((stat) => (

const COLORS = ["#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b"];

const monthlyData = [
                    className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}
  { mes: "Oct", usuarios: 78, completados: 23 },
  { mes: "Nov", usuarios: 112, completados: 38 },
  { mes: "Dic", usuarios: 156, completados: 54 },
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/10">
];

export default function GestionReportesPage() {
  return (
    <GestionLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
            <p className="text-muted-foreground">
              Informes de impacto y gestión
            </p>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="2025">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Ciudadanos formados",
              value: mockEstadisticas.usuariosRegistrados,
              icon: Users,
              color: "text-blue-600 bg-blue-100 dark:bg-blue-900/10 dark:text-blue-300",
              change: "+156%",
            },
            {
              label: "Trayectos completados",
              value: mockEstadisticas.trayectosCompletados,
              icon: BookOpen,
              color: "text-green-600 bg-green-100 dark:bg-green-900/10 dark:text-green-300",
              change: "+89%",
            },
            {
              label: "Certificados emitidos",
              value: mockEstadisticas.certificadosEmitidos,
              icon: Award,
              color: "text-purple-600 bg-purple-100 dark:bg-purple-900/10 dark:text-purple-300",
              change: "+67%",
            },
            {
              label: "Contenidos producidos",
              value:
                mockEstadisticas.videosDisponibles +
                mockEstadisticas.podcastsDisponibles,
              icon: FileText,
              color: "text-amber-600 bg-amber-100 dark:bg-amber-900/10 dark:text-amber-300",
              change: "+45%",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth chart */}
          <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Crecimiento mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="mes" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usuarios"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Usuarios"
                    />
                    <Line
                      type="monotone"
                      dataKey="completados"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Completados"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution chart */}
          <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Distribución por nivel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockEstadisticas.distribucionNivel}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nivel, percent }) =>
                        `${nivel} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="cantidad"
                      nameKey="nivel"
                    >
                      {mockEstadisticas.distribucionNivel.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report templates */}
        <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
          <CardHeader>
            <CardTitle className="text-lg">Reportes disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Informe de Formación Digital",
                  description:
                    "Resumen de usuarios formados, trayectos completados y certificados emitidos.",
                  icon: Users,
                  color: "text-blue-600 bg-blue-100",
                },
                {
                  title: "Alcance Ciudadano",
                  description:
                    "Métricas de alcance geográfico y demográfico de la plataforma.",
                  icon: TrendingUp,
                  color: "text-green-600 bg-green-100",
                },
                {
                  title: "Impacto de Contenidos",
                  description:
                    "Análisis de visualizaciones, engagement y feedback de contenidos.",
                  icon: BarChart3,
                  color: "text-purple-600 bg-purple-100",
                },
                {
                  title: "Participación Ciudadana",
                  description:
                    "Resumen de encuestas respondidas y devoluciones ciudadanas.",
                  icon: FileText,
                  color: "text-amber-600 bg-amber-100",
                },
                {
                  title: "Informe Mensual",
                  description:
                    "Consolidado mensual de todas las métricas de la plataforma.",
                  icon: Calendar,
                  color: "text-red-600 bg-red-100",
                },
                {
                  title: "Informe de Gestión",
                  description:
                    "Documento ejecutivo para presentación institucional.",
                  icon: Award,
                  color: "text-sky-600 bg-sky-100",
                },
              ].map((report) => (
                <div
                  key={report.title}
                  className="p-4 rounded-lg border border-muted hover:border-primary/30 hover:bg-muted/50 dark:border-muted/20 dark:hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 rounded-lg ${report.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <report.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {report.description}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                          <Download className="h-3 w-3" />
                          Excel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
                {
                  title: "Informe de Formación Digital",
                  description:
                    "Resumen de usuarios formados, trayectos completados y certificados emitidos.",
                  icon: Users,
                  color: "text-blue-600 bg-blue-100 dark:bg-blue-900/10 dark:text-blue-300",
                },
                {
                  title: "Alcance Ciudadano",
                  description:
                    "Métricas de alcance geográfico y demográfico de la plataforma.",
                  icon: TrendingUp,
                  color: "text-green-600 bg-green-100 dark:bg-green-900/10 dark:text-green-300",
                },
                {
                  title: "Impacto de Contenidos",
                  description:
                    "Análisis de visualizaciones, engagement y feedback de contenidos.",
                  icon: BarChart3,
                  color: "text-purple-600 bg-purple-100 dark:bg-purple-900/10 dark:text-purple-300",
                },
                {
                  title: "Participación Ciudadana",
                  description:
                    "Resumen de encuestas respondidas y devoluciones ciudadanas.",
                  icon: FileText,
                  color: "text-amber-600 bg-amber-100 dark:bg-amber-900/10 dark:text-amber-300",
                },
                {
                  title: "Informe Mensual",
                  description:
                    "Consolidado mensual de todas las métricas de la plataforma.",
                  icon: Calendar,
                  color: "text-red-600 bg-red-100 dark:bg-red-900/10 dark:text-red-300",
                },
                {
                  title: "Informe de Gestión",
                  description:
                    "Documento ejecutivo para presentación institucional.",
                  icon: Award,
                  color: "text-sky-600 bg-sky-100 dark:bg-sky-900/10 dark:text-sky-300",
                },
