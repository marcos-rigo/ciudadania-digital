"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { FiltersBar } from "@/components/ui/filters-bar"
import { StatusBadge } from "@/components/ui/status-badge"
import { DataTable, type Column } from "@/components/ui/data-table"
import { NoResultsState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { acciones, programas, tematicas, publicos, municipios } from "@/lib/mock/data"
import type { Accion } from "@/lib/types"
import { LayoutGrid, List, Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react"

export default function AccionesPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards")

  const filteredAcciones = useMemo(() => {
    return acciones.filter((accion) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          accion.municipio.toLowerCase().includes(searchLower) ||
          accion.programaNombre.toLowerCase().includes(searchLower) ||
          accion.tematicaPrincipal.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      if (filters.programa && filters.programa !== "all") {
        if (accion.programaId !== filters.programa) return false
      }

      if (filters.municipio && filters.municipio !== "all") {
        if (accion.municipio !== filters.municipio) return false
      }

      if (filters.tematica && filters.tematica !== "all") {
        if (accion.tematicaPrincipal !== filters.tematica) return false
      }

      if (filters.publico && filters.publico !== "all") {
        if (accion.publico !== filters.publico) return false
      }

      return true
    })
  }, [search, filters])

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterId]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({})
  }

  const columns: Column<Accion>[] = [
    {
      key: "fecha",
      header: "Fecha",
      cell: (accion) =>
        new Date(accion.fecha).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "municipio",
      header: "Municipio",
      cell: (accion) => (
        <div>
          <span className="font-medium">{accion.municipio}</span>
          {accion.localidad && (
            <span className="text-muted-foreground text-xs block">
              {accion.localidad}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "programaNombre",
      header: "Programa",
    },
    {
      key: "tematicaPrincipal",
      header: "Temática",
    },
    {
      key: "publico",
      header: "Público",
    },
    {
      key: "cantidadAsistentes",
      header: "Asistentes",
      className: "text-right",
    },
    {
      key: "modalidad",
      header: "Modalidad",
      cell: (accion) => <StatusBadge status={accion.modalidad} />,
    },
    {
      key: "actions",
      header: "",
      cell: (accion) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/acciones/${accion.id}`}>
            Ver
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      ),
    },
  ]

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Acciones realizadas"
          description="Registro de todas las acciones realizadas en el marco de nuestros programas."
          breadcrumbs={[{ label: "Acciones" }]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("cards")}
                aria-label="Vista de tarjetas"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
                aria-label="Vista de tabla"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          }
        />

        <div className="mt-8">
          <FiltersBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar acciones..."
            filters={[
              {
                id: "programa",
                label: "Programa",
                options: programas.map((p) => ({ value: p.id, label: p.nombre })),
              },
              {
                id: "municipio",
                label: "Municipio",
                options: municipios.map((m) => ({ value: m, label: m })),
              },
              {
                id: "tematica",
                label: "Temática",
                options: tematicas.map((t) => ({ value: t, label: t })),
              },
              {
                id: "publico",
                label: "Público",
                options: publicos.map((p) => ({ value: p, label: p })),
              },
            ]}
            filterValues={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="mt-8">
          {filteredAcciones.length === 0 ? (
            <NoResultsState searchTerm={search} />
          ) : viewMode === "table" ? (
            <DataTable
              columns={columns}
              data={filteredAcciones}
              keyExtractor={(accion) => accion.id}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAcciones.map((accion) => (
                <Card
                  key={accion.id}
                  className="group hover:shadow-lg transition-shadow border-border/50"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {accion.municipio}
                        </h3>
                        {accion.localidad && (
                          <p className="text-sm text-muted-foreground">
                            {accion.localidad}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={accion.modalidad} />
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(accion.fecha).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {accion.programaNombre}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {accion.cantidadAsistentes} asistentes • {accion.publico}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {accion.duracionMinutos} minutos
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-primary">
                        {accion.tematicaPrincipal}
                      </p>
                    </div>

                    <Button asChild variant="ghost" className="w-full mt-4">
                      <Link href={`/acciones/${accion.id}`}>
                        Ver detalle
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
