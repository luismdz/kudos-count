export interface Participante {
  nombre: string;
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
  codigo?: number;
  proyectoId?: string;
  participantes?: Participante[];
  fecha?: Date | number;
}
