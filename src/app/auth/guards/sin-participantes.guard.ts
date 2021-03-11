import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanDeactivate,
} from '@angular/router';
import { Observable } from 'rxjs';
import { KudosService } from '../../services/kudos.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SinParticipantesGuard implements CanActivate {
  constructor(private kudosSvc: KudosService) {}

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const votacionActualExiste = this.kudosSvc.validarVotacionExistente();

    const existenParticipantes =
      this.kudosSvc.participantes && this.kudosSvc.participantes.length > 0;

    if (votacionActualExiste || existenParticipantes) {
      return true;
    }

    return this.toast
      .fire({
        title: 'Debe iniciar un nuevo sorteo',
        icon: 'error',
      })
      .then(() => false);
  }
}
