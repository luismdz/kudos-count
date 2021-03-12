import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { customAlphabet } from 'nanoid';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Participante, Votacion } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class KudosService {
  private kudosDoc: AngularFirestoreCollection;
  // private alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private numbers = '0123456789';
  private votacionCodId = '';

  private participantes: Participante[] = [];
  participantes$ = new BehaviorSubject([]);
  codigoExiste$ = new BehaviorSubject(false);
  finalizado$ = new BehaviorSubject(false);

  constructor(private afs: AngularFirestore) {
    this.kudosDoc = this.afs.collection<Votacion>('kudos');
  }

  // Guarda sorteo en el LocalStorage
  private guardarVotacionActualEnLS(votacion: Votacion) {
    const date = new Date();
    const expiracion = date.setHours(date.getHours() + 12);
    localStorage.setItem('kudos', JSON.stringify({ ...votacion, expiracion }));
  }

  // Agrega lista ingresa al arreglo local y remueve cualquier dato en el LS
  agregarListaParticipantes(participantes: Participante[]) {
    this.participantes = participantes;
    this.participantes$.next(this.participantes);
    localStorage.removeItem('kudos');
  }

  // Agrega nuevo miembro a la lista y actualiza en firebase
  agregarParticipante(participante: Participante, votacionActual: Votacion) {
    this.participantes = [...votacionActual.participantes];

    this.participantes.push(participante);

    return this.kudosDoc
      .doc(votacionActual.id)
      .update({ participantes: this.participantes });
  }

  // Elimina miembro de la lista y actualiza en firebase
  eliminarParticipante(participante: Participante, votacionActual: Votacion) {
    const idx = this.participantes.findIndex(
      (x) => x.nombre.indexOf(participante.nombre) !== -1
    );

    this.participantes.splice(idx, 1);

    return this.kudosDoc
      .doc(votacionActual.id)
      .update({ participantes: this.participantes });
  }

  // Valida que sorteo exista con el codigo ingresado y devuelve el id
  async obtenerVotacionPorCodigo(codigo: string) {
    const snapshot = await this.kudosDoc.ref
      .where('codigo', '==', codigo)
      .where('finalizada', '==', false)
      .get();

    if (snapshot.empty) {
      return false;
    }

    this.codigoExiste$.next(true);

    this.votacionCodId = snapshot.docs[0].id;
    this.guardarVotacionActualEnLS({ id: this.votacionCodId });
    return true;
  }

  // Inicia un nuevo sorteo con la lista de participantes ingresada
  iniciarNuevaVotacion(): AngularFirestoreDocument<Votacion> {
    if (this.participantes.length <= 0) {
      return null;
    }

    // Genera unico codigo con nanoid
    const codigo = customAlphabet(this.numbers, 8);

    const votacion: Votacion = {
      codigo: codigo(),
      finalizada: false,
      fecha: new Date().getTime(),
      participantes: this.participantes.slice(),
    };

    const id = this.afs.createId();

    this.kudosDoc
      .doc(id)
      .set(votacion)
      .then(() => this.guardarVotacionActualEnLS({ id, codigo: codigo() }));

    return this.kudosDoc.doc(id);
  }

  // Valida si existe alguna votacion sin finalizar en el LS
  // Esto por si se refresca la pagina del sorteo
  validarVotacionExistente() {
    if (localStorage.getItem('kudos') === null) {
      return null;
    }

    const { id, expiracion } = JSON.parse(localStorage.getItem('kudos'));
    const fechaActual = new Date();

    if (fechaActual > new Date(expiracion)) {
      localStorage.removeItem('kudos');
      this.kudosDoc.doc(id).delete();
      return null;
    }

    return id;
  }

  /*
    Obtiene los datos de la votacion validando que:
      1. Fue ingresado codigo -> Devuelve sorteo con el codigo
      2. Sorteo existe en LocalStorage -> Devuelve sorteo con el id del LS
      3. Si 1 y 2 no aplican -> Inicia un nuevo sorteo
  */
  obtenerVotacion() {
    if (this.votacionCodId.length > 0) {
      return this.kudosDoc
        .doc(this.votacionCodId)
        .valueChanges({ idField: 'id' })
        .pipe(
          map((votacion) => {
            if (votacion.participantes) {
              const participantes = votacion.participantes?.sort((a, b) =>
                a.nombre > b.nombre ? 1 : -1
              );

              this.participantes = participantes.slice();
            }

            return {
              ...votacion,
              participantes: this.participantes,
            };
          })
        );
    }

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
            if (votacion.participantes && votacion.participantes.length > 0) {
              const participantes = votacion.participantes?.sort((a, b) =>
                a.nombre > b.nombre ? 1 : -1
              );

              this.participantes = participantes.slice();
            }

            return {
              ...votacion,
              participantes: this.participantes,
            };
          })
        );
    }

    return this.iniciarNuevaVotacion()
      .valueChanges({ idField: 'id' })
      .pipe(
        map((votacion) => {
          if (votacion.participantes && votacion.participantes.length > 0) {
            const participantes = votacion.participantes?.sort((a, b) =>
              a.nombre > b.nombre ? 1 : -1
            );

            this.participantes = participantes.slice();
          }

          return {
            ...votacion,
            participantes: this.participantes,
          };
        })
      );
  }

  // Actualiza votos de los participantes
  async votar(participante: Participante, { id, codigo }: Votacion) {
    const ref = await this.kudosDoc.ref.where('codigo', '==', codigo).get();

    let { participantes } = ref.docs[0].data();

    participantes = participantes.map((p) => {
      if (p.nombre.indexOf(participante.nombre) !== -1) {
        p.votos += 1;
        // p.mensajes = participante.mensajes;
      }
      // delete p.mensaje;
      return p;
    });

    return this.kudosDoc.doc(id).update({ participantes });
  }

  finalizarVotacionActual(votacion: Votacion) {
    const max = Math.max(...votacion.participantes.map((x) => x.votos));

    const ganadores = votacion.participantes
      .filter((x) => x.votos === max)
      .map((ganador) => ganador.nombre);

    this.kudosDoc.doc(votacion.id).update({ finalizada: true, ganadores });

    this.limpiarPropiedades();

    return ganadores;
  }

  limpiarPropiedades() {
    localStorage.removeItem('kudos');
    this.participantes = [];
    this.participantes$.next([]);
    this.codigoExiste$.next(false);
    this.finalizado$.next(false);
  }

  // Elimina el sorteo y limpia los BehaviorSubject y LocalStorage
  removerVotacion() {
    const id = this.validarVotacionExistente();

    if (id) {
      this.kudosDoc.doc(id).delete();
    }

    this.limpiarPropiedades();
  }
}
