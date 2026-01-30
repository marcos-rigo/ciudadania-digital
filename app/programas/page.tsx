"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { FiltersBar } from "@/components/ui/filters-bar"
import { StatusBadge } from "@/components/ui/status-badge"
import { TagChips } from "@/components/ui/tag-chips"
import { NoResultsState } from "@/components/ui/empty-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { programas, tematicas, publicos, territorios } from "@/lib/mock/data"
import { ArrowRight, MapPin, Users } from "lucide-react"

export default function ProgramasPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filteredProgramas = useMemo(() => {
    return programas.filter((programa) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          programa.nombre.toLowerCase().includes(searchLower) ||
          programa.descripcion.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Tematica filter
      if (filters.tematica && filters.tematica !== "all") {
        if (!programa.tematicas.includes(filters.tematica)) return false
      }

      // Publico filter
      if (filters.publico && filters.publico !== "all") {
        if (!programa.publicos.includes(filters.publico)) return false
      }

      // Territorio filter
      if (filters.territorio && filters.territorio !== "all") {
        if (!programa.territorios.includes(filters.territorio)) return false
      }

      // Estado filter
      if (filters.estado && filters.estado !== "all") {
        if (programa.estado !== filters.estado) return false
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

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Programas para la Ciudadanía"
          description="Conocé los programas de participación ciudadana que llevamos adelante en todo el territorio provincial."
          breadcrumbs={[{ label: "Programas" }]}
        />

        <div className="mt-8">
          <FiltersBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar programas..."
            filters={[
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
              {
                id: "territorio",
                label: "Territorio",
                options: territorios.map((t) => ({ value: t, label: t })),
              },
              {
                id: "estado",
                label: "Estado",
                options: [
                  { value: "activo", label: "Activo" },
                  { value: "en_pausa", label: "En Pausa" },
                  { value: "finalizado", label: "Finalizado" },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="mt-8">
          {filteredProgramas.length === 0 ? (
            <NoResultsState searchTerm={search} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProgramas.map((programa) => (
                <Card
                  key={programa.id}
                  className="group hover:shadow-lg transition-shadow border-border/50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {programa.nombre}
                      </CardTitle>
                      <StatusBadge status={programa.estado} />
                    </div>
                    <CardDescription className="line-clamp-2">
                      {programa.descripcion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">
                          {programa.territorios.slice(0, 2).join(", ")}
                          {programa.territorios.length > 2 &&
                            ` +${programa.territorios.length - 2}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="truncate">
                          {programa.publicos.slice(0, 2).join(", ")}
                          {programa.publicos.length > 2 &&
                            ` +${programa.publicos.length - 2}`}
                        </span>
                      </div>
                    </div>
                    <TagChips
                      tags={programa.tematicas.slice(0, 3)}
                      variant="primary"
                      size="sm"
                    />
                    <Button asChild variant="ghost" className="w-full mt-2">
                      <Link href={`/programas/${programa.slug}`}>
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
