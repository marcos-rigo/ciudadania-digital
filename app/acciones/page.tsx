"use client"

import { useState, useEffect, useMemo } from "react"
import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { NoResultsState } from "@/components/ui/empty-state"
import { sbGetActividades } from "@/lib/supabase-client"
import { Search, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Actividad {
  fecha: string
  programa: string
  localidad: string
  cantidad_personas: number
  usuario_nombre: string
}

const ANIOS = ["2026", "2025"]

const FILTRO_FECHA: Record<string, string> = {
  "2025": "&fecha=gte.2025-01-01&fecha=lt.2026-01-01",
  "2026": "&fecha=gte.2026-01-01&fecha=lt.2027-01-01",
}

function formatFecha(f: string) {
  if (!f) return "-"
  return new Date(f + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function AccionesPage() {
  const [anio, setAnio]               = useState("2026")
  const [data, setData]               = useState<Actividad[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [search, setSearch]           = useState("")
  const [filPrograma, setFilPrograma] = useState("all")
  const [filLocalidad, setFilLocalidad] = useState("all")
  const [pagina, setPagina]           = useState(1)
  const POR_PAGINA = 10

  useEffect(() => {
    setLoading(true)
    setError(false)
    setFilPrograma("all")
    setFilLocalidad("all")
    setSearch("")
    setPagina(1)

    sbGetActividades(
      `select=fecha,programa,localidad,cantidad_personas,usuario_nombre&order=fecha.desc${FILTRO_FECHA[anio]}`
    )
      .then((r) => setData(r as Actividad[]))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [anio])

  // Opciones únicas para los filtros (dinámicas según el año)
  const programasUnicos = useMemo(
    () => [...new Set(data.map((d) => d.programa).filter(Boolean))].sort(),
    [data]
  )
  const localidadesUnicas = useMemo(
    () => [...new Set(data.map((d) => d.localidad).filter(Boolean))].sort(),
    [data]
  )

  const filtered = useMemo(() => {
    return data.filter((a) => {
      if (search) {
        const q = search.toLowerCase()
        const match =
          (a.localidad ?? "").toLowerCase().includes(q) ||
          (a.programa ?? "").toLowerCase().includes(q)
        if (!match) return false
      }
      if (filPrograma !== "all" && a.programa !== filPrograma) return false
      if (filLocalidad !== "all" && a.localidad !== filLocalidad) return false
      return true
    })
  }, [data, search, filPrograma, filLocalidad])

  // Resetear a página 1 cuando cambian los filtros
  const applySearch   = (v: string)  => { setSearch(v);      setPagina(1) }
  const applyPrograma = (v: string)  => { setFilPrograma(v); setPagina(1) }
  const applyLocalidad = (v: string) => { setFilLocalidad(v); setPagina(1) }

  const hasFilters = search || filPrograma !== "all" || filLocalidad !== "all"

  const clearFilters = () => {
    setSearch("")
    setFilPrograma("all")
    setFilLocalidad("all")
    setPagina(1)
  }

  const totalPaginas = Math.ceil(filtered.length / POR_PAGINA)
  const paginated    = filtered.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const totalPersonas = filtered.reduce(
    (s, a) => s + (parseInt(String(a.cantidad_personas)) || 0),
    0
  )

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Acciones realizadas"
          description="Registro de actividades territoriales de la Secretaría de Participación Ciudadana."
          breadcrumbs={[{ label: "Acciones" }]}
          actions={
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger className="w-[110px] border-slate-200 shadow-sm font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANIOS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        {/* Filtros */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar acciones..."
              value={search}
              onChange={(e) => applySearch(e.target.value)}
              className="pl-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Programa */}
            <Select value={filPrograma} onValueChange={applyPrograma}>
              <SelectTrigger className="w-[200px] border-slate-200 shadow-sm">
                <SelectValue placeholder="Programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los programas</SelectItem>
                {programasUnicos.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Municipio / Comuna */}
            <Select value={filLocalidad} onValueChange={applyLocalidad}>
              <SelectTrigger className="w-[200px] border-slate-200 shadow-sm">
                <SelectValue placeholder="Municipio o Comuna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los municipios</SelectItem>
                {localidadesUnicas.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-slate-500 hover:text-slate-900">
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <span className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              No se pudieron cargar las actividades. Intentá de nuevo más tarde.
            </div>
          ) : filtered.length === 0 ? (
            <NoResultsState searchTerm={search} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Resumen */}
              <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
                <span className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{filtered.length}</span> actividades
                </span>
                <span className="text-sm text-slate-500">
                  <span className="font-semibold text-blue-700">
                    {totalPersonas.toLocaleString("es-AR")}
                  </span>{" "}
                  personas alcanzadas
                </span>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {["Fecha", "Municipio / Comuna", "Programa", "Personas"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wide border-b border-slate-200"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((a, i) => (
                      <tr
                        key={i}
                        className="hover:bg-blue-50/40 border-b border-slate-100 last:border-0 transition-colors duration-150"
                      >
                        <td className="px-5 py-3 text-slate-600 tabular-nums whitespace-nowrap">
                          {formatFecha(a.fecha)}
                        </td>
                        <td className="px-5 py-3 font-medium text-slate-900">
                          {a.localidad || "-"}
                        </td>
                        <td className="px-5 py-3 text-slate-700">
                          {a.programa || "-"}
                        </td>
                        <td className="px-5 py-3 font-bold text-blue-700 tabular-nums text-center">
                          {(parseInt(String(a.cantidad_personas)) || 0).toLocaleString("es-AR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50">
                  <span className="text-xs text-slate-500">
                    Página <span className="font-semibold text-slate-700">{pagina}</span> de{" "}
                    <span className="font-semibold text-slate-700">{totalPaginas}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagina(1)}
                      disabled={pagina === 1}
                      className="h-8 w-8 p-0 border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      «
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={pagina === 1}
                      className="h-8 px-3 border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      Anterior
                    </Button>

                    {/* Números de página */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                        .filter((n) => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
                        .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                          if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…")
                          acc.push(n)
                          return acc
                        }, [])
                        .map((n, idx) =>
                          n === "…" ? (
                            <span key={`e${idx}`} className="px-1 text-slate-400 text-sm">…</span>
                          ) : (
                            <Button
                              key={n}
                              variant={pagina === n ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPagina(n as number)}
                              className={`h-8 w-8 p-0 text-sm ${
                                pagina === n
                                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                  : "border-slate-200 text-slate-600 hover:border-blue-300"
                              }`}
                            >
                              {n}
                            </Button>
                          )
                        )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={pagina === totalPaginas}
                      className="h-8 px-3 border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      Siguiente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagina(totalPaginas)}
                      disabled={pagina === totalPaginas}
                      className="h-8 w-8 p-0 border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      »
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
