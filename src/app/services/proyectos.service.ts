import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Proyecto } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  private proyectosCollection: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    this.proyectosCollection = this.afs.collection<Proyecto[]>(
      'proyectosKudos'
    );
  }

  obtenerProyectos(): Observable<Proyecto[]> {
    return this.proyectosCollection.valueChanges({ idField: 'id' }).pipe(
      map((proyectos: any) => {
        return proyectos.map(
          (proyecto: any) =>
            <Proyecto>{
              nombre: proyecto.nombre,
              id: proyecto.id,
              fechaCreacion: new Date(proyecto.fechaCreacion),
            }
        );
      })
    );
  }

  agregarNuevoProyecto(proyecto: Proyecto) {}
}
