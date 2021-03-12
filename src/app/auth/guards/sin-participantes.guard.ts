import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanDeactivate,
} from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { KudosService } from '../../services/kudos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SinParticipantesGuard implements CanActivate {
  constructor(private kudosSvc: KudosService, private router: Router) {}

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
    const sorteoExistente = this.kudosSvc.validarVotacionExistente();

    const sub = combineLatest([
      this.kudosSvc.codigoExiste$,
      this.kudosSvc.finalizado$,
      this.kudosSvc.participantes$,
    ]).pipe(
      map((resp) => {
        const [
          ingresoPorCodigo,
          votacionFinalizada,
          existenParticipantes,
        ] = resp;

        if (
          existenParticipantes.length > 0 ||
          ingresoPorCodigo ||
          votacionFinalizada ||
          sorteoExistente
        ) {
          return true;
        }

        this.toast
          .fire({
            title: 'Debe iniciar un nuevo sorteo',
            icon: 'error',
          })
          .then(() => {
            this.router.navigateByUrl('/home');
            return false;
          });
      })
    );

    return sub;
  }
}
