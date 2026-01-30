"use client"

import { useState } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PageHeader } from "@/components/ui/page-header"
import { FiltersBar } from "@/components/ui/filters-bar"
import { StatusBadge } from "@/components/ui/status-badge"
import { TagChips } from "@/components/ui/tag-chips"
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
import { programas, tematicas } from "@/lib/mock/data"
import type { Programa } from "@/lib/types"
import { Plus, Edit, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ProgramasEquipoPage() {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredProgramas = programas.filter((programa) => {
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        programa.nombre.toLowerCase().includes(searchLower) ||
        programa.descripcion.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const columns: Column<Programa>[] = [
    {
      key: "nombre",
      header: "Nombre",
      cell: (programa) => (
        <div>
          <p className="font-medium">{programa.nombre}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {programa.descripcion}
          </p>
        </div>
      ),
    },
    {
      key: "tematicas",
      header: "Temáticas",
      cell: (programa) => (
        <TagChips tags={programa.tematicas.slice(0, 2)} variant="primary" size="sm" />
      ),
    },
    {
      key: "territorios",
      header: "Territorios",
      cell: (programa) => (
        <span className="text-sm text-muted-foreground">
          {programa.territorios.length} municipios
        </span>
      ),
    },
    {
      key: "responsables",
      header: "Responsables",
      cell: (programa) => (
        <span className="text-sm">{programa.responsables.join(", ")}</span>
      ),
    },
    {
      key: "estado",
      header: "Estado",
      cell: (programa) => <StatusBadge status={programa.estado} />,
    },
    {
      key: "actions",
      header: "",
      cell: (programa) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/equipo/programas/${programa.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="Gestión de Programas"
        description="Administra los programas de participación ciudadana."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Programa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo Programa</DialogTitle>
                <DialogDescription>
                  Completá los datos del nuevo programa. Los campos con * son obligatorios.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input id="nombre" placeholder="Nombre del programa" />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Descripción del programa"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="objetivos">Objetivos</Label>
                    <Textarea
                      id="objetivos"
                      placeholder="Un objetivo por línea"
                      rows={3}
                    />
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
                    <Label htmlFor="estado">Estado *</Label>
                    <Select defaultValue="activo">
                      <SelectTrigger id="estado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="en_pausa">En Pausa</SelectItem>
                        <SelectItem value="finalizado">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsables">Responsables</Label>
                    <Input id="responsables" placeholder="Separados por coma" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha de inicio</Label>
                    <Input id="fechaInicio" type="date" />
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
                    alert("Demo: Programa creado (simulado)")
                  }}
                >
                  Crear Programa
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
          searchPlaceholder="Buscar programas..."
          onClearFilters={() => setSearch("")}
        />
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredProgramas}
          keyExtractor={(programa) => programa.id}
        />
      </div>
    </AdminLayout>
  )
}
