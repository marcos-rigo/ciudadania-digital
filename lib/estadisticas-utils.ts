const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

interface ActividadBase {
  fecha?: string | null
  programa?: string | null
  localidad?: string | null
  cantidad_personas?: number | string | null
  tematica?: string | null
}

export function calcularKPIs(actividades: ActividadBase[]) {
  const total = actividades.length
  const personas = actividades.reduce(
    (s, a) => s + (parseInt(String(a.cantidad_personas ?? 0)) || 0), 0
  )
  const localidades = new Set(actividades.map((a) => a.localidad).filter(Boolean)).size
  const promedio = total > 0 ? Math.round(personas / total) : 0
  return { total, personas, localidades, promedio }
}

export function agruparPorMes(actividades: ActividadBase[]): { mes: string; cantidad: number }[] {
  const conteo = Array(12).fill(0)
  for (const a of actividades) {
    const mes = parseInt(a.fecha?.slice(5, 7) ?? '0') - 1
    if (mes >= 0 && mes < 12) conteo[mes]++
  }
  return MESES.map((mes, i) => ({ mes, cantidad: conteo[i] }))
}

export function calcularPersonasPorMes(actividades: ActividadBase[]): { mes: string; personas: number }[] {
  const totales = Array(12).fill(0)
  for (const a of actividades) {
    const mes = parseInt(a.fecha?.slice(5, 7) ?? '0') - 1
    if (mes >= 0 && mes < 12) {
      totales[mes] += parseInt(String(a.cantidad_personas ?? 0)) || 0
    }
  }
  return MESES.map((mes, i) => ({ mes, personas: totales[i] }))
}

export function agruparPorPrograma(actividades: ActividadBase[]): { programa: string; cantidad: number }[] {
  const conteo: Record<string, number> = {}
  for (const a of actividades) {
    const k = a.programa || 'Sin datos'
    conteo[k] = (conteo[k] || 0) + 1
  }
  return Object.entries(conteo)
    .map(([programa, cantidad]) => ({ programa, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
}

export function agruparPorLocalidad(actividades: ActividadBase[]): { localidad: string; cantidad: number }[] {
  const conteo: Record<string, number> = {}
  for (const a of actividades) {
    const k = a.localidad || 'Sin datos'
    conteo[k] = (conteo[k] || 0) + 1
  }
  return Object.entries(conteo)
    .map(([localidad, cantidad]) => ({ localidad, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
}

export function agruparPorTematica(actividades: ActividadBase[]): { tematica: string; cantidad: number }[] {
  const conteo: Record<string, number> = {}
  for (const a of actividades) {
    const k = a.tematica || 'Sin datos'
    conteo[k] = (conteo[k] || 0) + 1
  }
  return Object.entries(conteo)
    .map(([tematica, cantidad]) => ({ tematica, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
}
