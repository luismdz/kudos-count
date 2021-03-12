import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { KudosService } from '../../services/kudos.service';

@Injectable({
  providedIn: 'root',
})
export class GuardarCambiosGuard implements CanDeactivate<any> {
  constructor(private kudosSvc: KudosService) {}

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const finalizado = this.kudosSvc.finalizado$.value;

    if (!finalizado) {
      return Swal.fire({
        icon: 'warning',
        title: 'Votación sin finalizar',
        text: 'Tiene una votación activa, seguro que desea cancelar?',
        showConfirmButton: true,
        confirmButtonText: 'Confirmar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.kudosSvc.limpiarPropiedades();
          return true;
        } else {
          return false;
        }
      });
    } else {
      return true;
    }
  }
}
