import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { KudosService } from '../services/kudos.service';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GuardarCambiosGuard implements CanDeactivate<unknown> {
  constructor(private kudosSvc: KudosService) {}

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.kudosSvc.finalizado$.value) {
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
          this.kudosSvc.removerVotacion();
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
