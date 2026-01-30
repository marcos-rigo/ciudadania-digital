"use client"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PageHeader } from "@/components/ui/page-header"
import { FiltersBar } from "@/components/ui/filters-bar"
import { StatusBadge } from "@/components/ui/status-badge"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { acciones, programas, tematicas, publicos, municipios } from "@/lib/mock/data"
import type { Accion } from "@/lib/types"
import { Plus, Eye, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AccionesEquipoPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredAcciones = useMemo(() => {
    return acciones.filter((accion) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          accion.municipio.toLowerCase().includes(searchLower) ||
          accion.programaNombre.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      if (filters.programa && filters.programa !== "all") {
        if (accion.programaId !== filters.programa) return false
      }

      if (filters.municipio && filters.municipio !== "all") {
        if (accion.municipio !== filters.municipio) return false
      }

      return true
    })
  }, [search, filters])

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterId]: value }))
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
      header: "Ubicación",
      cell: (accion) => (
        <div>
          <p className="font-medium">{accion.municipio}</p>
          {accion.localidad && (
            <p className="text-sm text-muted-foreground">{accion.localidad}</p>
          )}
        </div>
      ),
    },
    {
      key: "programaNombre",
      header: "Programa",
      cell: (accion) => (
        <span className="text-sm">{accion.programaNombre}</span>
      ),
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
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="Gestión de Acciones"
        description="Registra y administra las actividades realizadas."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Acción
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nueva Acción</DialogTitle>
                <DialogDescription>
                  Registrá una nueva actividad. Los campos con * son obligatorios.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Input id="fecha" type="date" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="programa">Programa *</Label>
                    <Select>
                      <SelectTrigger id="programa">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {programas.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="municipio">Municipio *</Label>
                    <Select>
                      <SelectTrigger id="municipio">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {municipios.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localidad">Localidad / Barrio</Label>
                    <Input id="localidad" placeholder="Opcional" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tematica">Temática principal *</Label>
                    <Select>
                      <SelectTrigger id="tematica">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {tematicas.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publico">Público objetivo *</Label>
                    <Select>
                      <SelectTrigger id="publico">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {publicos.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asistentes">Cantidad de asistentes *</Label>
                    <Input id="asistentes" type="number" min="0" placeholder="0" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duracion">Duración (minutos) *</Label>
                    <Input id="duracion" type="number" min="0" placeholder="60" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modalidad">Modalidad *</Label>
                    <Select>
                      <SelectTrigger id="modalidad">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Descripción de la actividad..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="devoluciones">Devoluciones / Aportes</Label>
                    <Textarea
                      id="devoluciones"
                      placeholder="Comentarios o feedback recibido..."
                      rows={3}
                    />
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setDialogOpen(false)
                    alert("Demo: Acción registrada (simulado)")
                  }}
                >
                  Registrar Acción
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mt-6">
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
          ]}
          filterValues={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => {
            setSearch("")
            setFilters({})
          }}
        />
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredAcciones}
          keyExtractor={(accion) => accion.id}
        />
      </div>
    </AdminLayout>
  )
}
