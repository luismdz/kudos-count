import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Participante, Proyecto, Votacion } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class KudosService {
  private kudosDoc: AngularFirestoreCollection;
  private proyectoId = 'xFOAL3g9eZpEaQaKMcnI';
  participantes: Participante[] = [];
  finalizado$ = new BehaviorSubject(false);

  constructor(private afs: AngularFirestore) {
    this.kudosDoc = this.afs.collection<Votacion>('kudos');
  }

  agregarListaParticipantes(
    participantes: Participante[],
    proyecto?: Proyecto
  ) {
    this.participantes = participantes;
    // this.participante$.next(participantes);
    localStorage.removeItem('kudos');

    if (proyecto !== null) {
      // ... actualizar lista del proyecto actual
      // ... proyectoId = proyecto.id
    }
  }

  agregarParticipante(
    participante: Participante,
    votacionActual: Votacion,
    proyecto?: Proyecto
  ) {
    if (proyecto !== null) {
      // ... agregar participante al proyecto actual
    }
    this.participantes = [...votacionActual.participantes];

    this.participantes.push(participante);

    return this.kudosDoc
      .doc(votacionActual.id)
      .update({ participantes: this.participantes });
  }

  eliminarParticipante(
    participante: Participante,
    votacionActual: Votacion,
    proyecto?: Proyecto
  ) {
    if (proyecto !== null) {
      // ... agregar participante al proyecto actual
    }

    const idx = this.participantes.findIndex(
      (x) => x.nombre.indexOf(participante.nombre) !== -1
    );

    this.participantes.splice(idx, 1);

    return this.kudosDoc
      .doc(votacionActual.id)
      .update({ participantes: this.participantes });
  }

  obtenerVotacion() {
    const curId = this.validarVotacionExistente();

    if (curId !== null) {
      return this.afs
        .collection<Votacion>('kudos')
        .doc(curId)
        .valueChanges({
          idField: 'id',
        })
        .pipe(
          map((votacion) => {
            const participantes = votacion.participantes?.sort(
              (a, b) => b.votos - a.votos
            );

            this.participantes = participantes.slice();

            return {
              ...votacion,
              participantes,
            };
          })
        );
    }

    return this.iniciarNuevaVotacion()
      .valueChanges({ idField: 'id' })
      .pipe(
        map((votacion) => {
          const participantes = votacion.participantes?.sort(
            (a, b) => b.votos - a.votos
          );

          return {
            ...votacion,
            participantes,
          };
        })
      );
  }

  iniciarNuevaVotacion(): AngularFirestoreDocument<Votacion> {
    if (this.participantes.length <= 0) {
      return null;
    }

    // const codigo =
    //   Math.random().toString().substring(2, 7) +
    //   Date.now().toString().substring(10, 13);

    const votacion: Votacion = {
      // codigo: +codigo,
      fecha: new Date().getTime(),
      participantes: this.participantes.slice(),
    };

    if (this.proyectoId && this.proyectoId.length > 0) {
      votacion.proyectoId = this.proyectoId;
    }

    const id = this.afs.createId();

    this.kudosDoc
      .doc(id)
      .set(votacion)
      .then(() => this.guardarVotacionActualEnLS({ id }));

    return this.afs.collection<Votacion>('kudos').doc(id);
  }

  validarVotacionExistente() {
    if (localStorage.getItem('kudos') === null) {
      return null;
    }

    const { id, expiracion } = JSON.parse(localStorage.getItem('kudos'));
    const fechaActual = new Date();

    if (fechaActual > new Date(expiracion)) {
      localStorage.removeItem('kudos');
      return null;
    }

    return id;
  }

  votar({ id, participantes }: Votacion) {
    return this.kudosDoc.doc(id).update({ participantes });
  }

  finalizarVotacionActual(votacion: Votacion) {
    localStorage.removeItem('kudos');
    this.finalizado$.next(true);

    const max = Math.max(...votacion.participantes.map((x) => x.votos));

    const ganadores = votacion.participantes
      .filter((x) => x.votos === max)
      .map((ganador) => ganador.nombre);

    return ganadores;
  }

  removerVotacion() {
    localStorage.removeItem('kudos');
    this.participantes = [];
  }

  private guardarVotacionActualEnLS(votacion: Votacion) {
    const date = new Date();
    const expiracion = date.setHours(date.getHours() + 6);
    localStorage.setItem('kudos', JSON.stringify({ ...votacion, expiracion }));
  }
}
