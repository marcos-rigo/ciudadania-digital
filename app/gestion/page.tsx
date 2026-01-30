"use client";

import { GestionLayout } from "@/components/layouts/gestion-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  PlayCircle,
  Award,
  TrendingUp,
  FileQuestion,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  mockEstadisticas,
  mockUsers,
  mockVideos,
} from "@/lib/mock/ciudadania-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#8b5cf6"];

export default function GestionDashboardPage() {
  return (
    <GestionLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen de la plataforma de Ciudadanía Digital
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Usuarios registrados",
              value: mockEstadisticas.usuariosRegistrados,
              icon: Users,
              change: "+12%",
              changeType: "positive",
              color: "text-blue-600 dark:text-blue-300",
              bgColor: "bg-blue-100 dark:bg-blue-900/10",
            },
            {
              title: "Trayectos completados",
              value: mockEstadisticas.trayectosCompletados,
              icon: BookOpen,
              change: "+8%",
              changeType: "positive",
              color: "text-green-600 dark:text-green-300",
              bgColor: "bg-green-100 dark:bg-green-900/10",
            },
            {
              title: "Videos vistos",
              value: mockEstadisticas.videosVistos,
              icon: PlayCircle,
              change: "+23%",
              changeType: "positive",
              color: "text-red-600 dark:text-red-300",
              bgColor: "bg-red-100 dark:bg-red-900/10",
            },
            {
              title: "Certificados emitidos",
              value: mockEstadisticas.certificadosEmitidos,
              icon: Award,
              change: "+5%",
              changeType: "positive",
              color: "text-purple-600 dark:text-purple-300",
              bgColor: "bg-purple-100 dark:bg-purple-900/10",
            },
          ].map((kpi) => (
            <Card key={kpi.title} className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {kpi.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {kpi.value}
                    </p>
                    <p
                      className={`text-sm flex items-center gap-1 mt-1 ${kpi.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                    >
                      {kpi.changeType === "positive" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {kpi.change} vs mes anterior
                    </p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-xl ${kpi.bgColor} ${kpi.color} flex items-center justify-center`}
                  >
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
              {
              {
              {
              {
              {
              {
            ].map((kpi) => (
            <CardHeader>
              <CardTitle className="text-lg">Progreso semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockEstadisticas.progresoSemanal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="semana" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usuarios"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Nuevos usuarios"
                    />
                    <Line
                      type="monotone"
                      dataKey="completados"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Trayectos completados"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution by level */}
          <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
            <CardHeader>
              <CardTitle className="text-lg">
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
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

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most watched videos */}
          <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-red-600" />
                Videos más vistos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEstadisticas.videosMasVistos.map((video, index) => (
                  <div
                    key={video.titulo}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium dark:bg-muted/20">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground line-clamp-1">
                        {video.titulo}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {video.vistas} vistas
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent users */}
          <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Usuarios recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-medium dark:bg-sky-900/10 dark:text-sky-300">
                        {user.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div
                        className={`h-12 w-12 rounded-xl ${kpi.bgColor} ${kpi.color} flex items-center justify-center`}
                          {user.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.fechaRegistro).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Trayectos activos",
              value: mockEstadisticas.trayectosActivos,
              icon: BookOpen,
            },
            {
              label: "Videos disponibles",
              value: mockEstadisticas.videosDisponibles,
              icon: PlayCircle,
            },
            {
              label: "Evaluaciones completadas",
              value: mockEstadisticas.evaluacionesCompletadas,
              icon: TrendingUp,
            },
            {
              label: "Encuestas respondidas",
              value: mockEstadisticas.encuestasRespondidas,
              icon: FileQuestion,
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center dark:bg-muted/20">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
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
      </div>
    </GestionLayout>
  );
}
