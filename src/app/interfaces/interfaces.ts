export interface Participante {
  id?: number;
  nombre: string;
  mensaje?: string;
  mensajes?: string[];
  votos?: number;
}

export interface Proyecto {
  id?: string;
  nombre?: string;
  fechaCreacion?: Date | number;
  participantes?: Participante[];
  userId?: string;
}

export interface Votacion {
  id?: string;
  codigo?: string;
  finalizada?: boolean;
  participantes?: Participante[];
  fecha?: Date | number;
  ganadores?: string[];
}
