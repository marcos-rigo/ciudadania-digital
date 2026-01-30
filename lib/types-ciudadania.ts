export interface User {
  id: string;
  nombre: string;
  email: string;
  avatar: string | null;
  fechaRegistro: string;
  trayectosIniciados: string[];
  trayectosCompletados: string[];
  videosVistos: string[];
  evaluacionesRealizadas: string[];
  certificados: string[];
}

export interface Modulo {
  id: string;
  titulo: string;
  descripcion: string;
  videos: string[];
  podcasts: string[];
  orden: number;
}

export interface Trayecto {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  nivel: "Inicial" | "Intermedio" | "Avanzado";
  modulos: Modulo[];
  requisitos: string[];
  evaluacionId: string;
  imagen: string;
  color: string;
  contenidosTotal: number;
  activo: boolean;
  recomendado?: boolean;
  videos?: string[];
  podcasts?: string[];
}

export interface VideoEducativo {
  id: string;
  titulo: string;
  descripcion: string;
  youtubeId: string;
  duracion: string;
  duracionMinutos?: number;
  tema: string;
  trayectoId: string;
  nivel: string;
  orden: number;
  textoEducativo: string;
  tags?: string[];
  thumbnail?: string;
}

export interface PodcastEpisode {
  id: string;
  titulo: string;
  descripcion: string;
  spotifyEpisodeId: string;
  youtubeId?: string;
  duracion?: string;
  tema?: string;
  trayectoId?: string;
  invitados?: string[];
  tags?: string[];
  thumbnail?: string;
}

export interface PreguntaBase {
  id: string;
  pregunta: string;
}

export interface PreguntaMultiple extends PreguntaBase {
  tipo: "multiple";
  opciones: string[];
  respuestaCorrecta: number;
}

export interface PreguntaVerdaderoFalso extends PreguntaBase {
  tipo: "verdadero_falso";
  respuestaCorrecta: boolean;
}

export interface PreguntaReflexiva extends PreguntaBase {
  tipo: "reflexiva";
}

export type Pregunta =
  | PreguntaMultiple
  | PreguntaVerdaderoFalso
  | PreguntaReflexiva;

export interface Evaluacion {
  id: string;
  titulo: string;
  trayectoId: string;
  preguntas: Pregunta[];
  tiempoEstimado: string;
  intentosPermitidos: number;
}

export interface Encuesta {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: "google_forms" | "excel_online";
  embedUrl: string;
  activa: boolean;
  fechaCreacion: string;
  respuestas: number;
}

export interface Certificado {
  id: string;
  usuarioId: string;
  trayectoId: string;
  nombreUsuario: string;
  tituloTrayecto: string;
  fechaEmision: string;
  codigoVerificacion: string;
}

export interface ResultadoEvaluacion {
  id: string;
  usuarioId: string;
  evaluacionId: string;
  respuestas: Record<string, number | boolean | string>;
  puntaje: number;
  aprobado: boolean;
  fechaRealizacion: string;
}
