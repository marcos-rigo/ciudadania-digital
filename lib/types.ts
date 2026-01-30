// Tipos para el Sistema Integral de Información y Comunicación Estratégica

export type EstadoPrograma = 'activo' | 'en_pausa' | 'finalizado'
export type Modalidad = 'presencial' | 'virtual' | 'hibrido'
export type NivelCapacitacion = 'basico' | 'intermedio' | 'avanzado'
export type TipoMaterial = 'pdf' | 'guia' | 'presentacion' | 'documento'
export type TipoTablero = 'power_bi' | 'looker' | 'metabase'
export type Sentimiento = 'positivo' | 'neutral' | 'negativo'
export type RolUsuario = 'admin' | 'editor' | 'lector'

export interface Programa {
  id: string
  slug: string
  nombre: string
  descripcion: string
  objetivos: string[]
  publicos: string[]
  territorios: string[]
  tematicas: string[]
  estado: EstadoPrograma
  responsables: string[]
  fechaInicio: string
  fechaFin?: string
  imagenUrl?: string
}

export interface Accion {
  id: string
  fecha: string
  municipio: string
  localidad?: string
  programaId: string
  programaNombre: string
  tematicaPrincipal: string
  tematicasSecundarias?: string[]
  publico: string
  cantidadAsistentes: number
  duracionMinutos: number
  modalidad: Modalidad
  descripcion?: string
  devoluciones?: string
  materiales?: string[]
}

export interface Video {
  id: string
  titulo: string
  descripcion: string
  programaId?: string
  programaNombre?: string
  tematica: string
  publico: string
  nivel: NivelCapacitacion
  duracionMinutos: number
  enlace: string
  miniatura?: string
  fechaPublicacion: string
}

export interface Material {
  id: string
  tipo: TipoMaterial
  titulo: string
  descripcion?: string
  programaId?: string
  programaNombre?: string
  tematica: string
  enlaceDescarga: string
  fechaPublicacion: string
}

export interface Tablero {
  id: string
  nombre: string
  descripcion: string
  tipo: TipoTablero
  urlEmbed: string
  categoria: string
  fechaCreacion: string
}

export interface Documento {
  id: string
  titulo: string
  categoria: string
  descripcion?: string
  enlaceDescarga: string
  fechaPublicacion: string
}

export interface FAQ {
  id: string
  pregunta: string
  respuesta: string
  categoria: string
}

export interface KPI {
  id: string
  titulo: string
  valor: number | string
  unidad?: string
  variacion?: number
  descripcion?: string
  icono?: string
}

export interface Alerta {
  id: string
  tipo: 'warning' | 'info' | 'success' | 'error'
  titulo: string
  descripcion: string
  fecha: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: RolUsuario
  avatar?: string
}

export interface AnalisisIA {
  etiquetas: string[]
  resumen: string[]
  problematicas: string[]
  sentimiento: Sentimiento
}

// Tipos para filtros
export interface FiltrosProgramas {
  busqueda?: string
  tematica?: string
  publico?: string
  territorio?: string
  estado?: EstadoPrograma
}

export interface FiltrosAcciones {
  fechaInicio?: string
  fechaFin?: string
  municipio?: string
  programaId?: string
  tematica?: string
  publico?: string
}

// Tipos para datos de gráficos
export interface DatoGrafico {
  nombre: string
  valor: number
  [key: string]: string | number
}

export interface DatoEvolucion {
  mes: string
  actividades: number
  asistentes: number
}
