import { Component, OnDestroy, OnInit } from '@angular/core';
import { KudosService } from '../../services/kudos.service';
import { Participante, Votacion } from '../../interfaces/interfaces';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kudos',
  templateUrl: './kudos.component.html',
  styleUrls: ['./kudos.component.css'],
})
export class KudosComponent implements OnInit, OnDestroy {
  participantes: Participante[] = [];
  datosGrafico = [];
  votacion: Votacion;
  isLoading = true;
  private kudosSubscription: Subscription;
  // actualizar = true;
  // participantesOriginal = [];

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  });

  constructor(private kudosSvc: KudosService, private router: Router) {
    this.kudosSubscription = this.kudosSvc
      .obtenerVotacion()
      .subscribe((votacion: Votacion) => {
        if (votacion.finalizada) {
          this.kudosSvc.finalizado$.next(true);
          this.mostrarGanadores(votacion.ganadores);
          this.kudosSubscription.unsubscribe();
          this.isLoading = false;
        } else {
          this.cargarDatos(votacion);
          this.isLoading = false;
          // this.kudosSubscription.unsubscribe();
        }
      });
  }
  ngOnDestroy(): void {
    // this.kudosSubscription.unsubscribe();
  }

  ngOnInit(): void {}

  private cargarDatos(votacion: Votacion) {
    if (votacion && votacion !== undefined && votacion.participantes) {
      this.votacion = votacion;

      // if (this.actualizar) {
      //   this.actualizar = false;
      // }
      this.participantes = this.votacion.participantes;

      this.datosGrafico = this.votacion.participantes
        .map(({ nombre, votos }) => ({
          name: nombre,
          value: votos,
        }))
        .sort((a, b) => b.value - a.value);
    }
  }

  recibirNuevoParticipante(nuevoParticipante: Participante) {
    // this.actualizar = true;

    this.kudosSvc
      .agregarParticipante(nuevoParticipante, this.votacion)
      .then(() => {
        this.toast.fire({
          icon: 'info',
          title: 'Participante agregado!',
        });
      });
  }

  eliminarParticipante(participante: Participante) {
    // this.actualizar = true;

    this.kudosSvc.eliminarParticipante(participante, this.votacion).then(() =>
      this.toast.fire({
        icon: 'error',
        title: 'Participante eliminado',
      })
    );
  }

  recibirVoto(participante: Participante) {
    this.kudosSvc.votar(participante, this.votacion).then(() =>
      this.toast.fire({
        icon: 'success',
        title: 'Voto recibido!',
      })
    );
  }

  finalizarVotacion() {
    Swal.fire({
      title: 'Finalizar votacion?',
      text: 'Seguro que desea terminar la votacion?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.kudosSvc.finalizarVotacionActual(this.votacion);
      }
    });
  }

  private mostrarGanadores(ganadores: string[]) {
    const htmlTextTitle = `
          <p class="mt-0 mb-2 font-weigth-bold" style="font-size:2rem">
            <strong>${ganadores.length > 1 ? 'Ganadores:' : 'Ganador:'}</strong>
          </p>
        `;

    let htmlTextBody = '';

    ganadores.forEach((ganador) => {
      htmlTextBody += `
            <li class="list-group-item border-0 py-1 text-success" style="font-size:1.4rem">
              ${ganador}
            </li>
          `;
    });

    Swal.fire({
      icon: 'success',
      // title: 'Votación finalizada!',
      html: `
            ${htmlTextTitle}
            <ul class="list-group mb-1">
              ${htmlTextBody}
            </ul>
          `,
    }).then(() => {
      this.router.navigateByUrl('/home');
    });
  }
}
