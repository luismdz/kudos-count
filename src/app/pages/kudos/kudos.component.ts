import { Component, OnInit } from '@angular/core';
import { KudosService } from '../../services/kudos.service';
import { Participante, Votacion } from '../../interfaces/interfaces';
import { take, takeLast, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kudos',
  templateUrl: './kudos.component.html',
  styleUrls: ['./kudos.component.css'],
})
export class KudosComponent implements OnInit {
  participantes: Participante[] = [];
  datosGrafico = [];
  votacion: Votacion;

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  });

  constructor(private kudosSvc: KudosService, private router: Router) {
    this.kudosSvc
      .obtenerVotacion()
      .subscribe((votacion: Votacion) => this.cargarDatos(votacion));
  }

  ngOnInit(): void {}

  private cargarDatos(votacion: Votacion) {
    if (votacion) {
      this.votacion = votacion;

      this.participantes = this.votacion.participantes;

      this.datosGrafico = this.votacion.participantes.map(
        ({ nombre, votos }) => ({
          name: nombre,
          value: votos,
        })
      );
    }
  }

  recibirNuevoParticipante(nuevoParticipante: Participante) {
    this.kudosSvc
      .agregarParticipante(nuevoParticipante, this.votacion)
      .then(() =>
        this.toast.fire({
          icon: 'info',
          title: 'Participante agregado!',
        })
      );
  }

  eliminarParticipante(participante: Participante) {
    this.kudosSvc.eliminarParticipante(participante, this.votacion).then(() =>
      this.toast.fire({
        icon: 'error',
        title: 'Participante eliminado',
      })
    );
  }

  recibirVoto() {
    this.kudosSvc.votar(this.votacion).then(() =>
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
        const ganadores = this.kudosSvc.finalizarVotacionActual(this.votacion);

        const htmlTextTitle = `
          <p class="mt-3 mb-2">
            <strong>${ganadores.length > 1 ? 'Ganadores:' : 'Ganador:'}</strong>
          </p>
        `;

        let htmlTextBody = '';

        ganadores.forEach((ganador) => {
          htmlTextBody += `
            <li class="list-group-item border-0 py-1 text-success">
              ${ganador}
            </li>
          `;
        });

        Swal.fire({
          icon: 'success',
          title: 'Votación finalizada!',
          html: `
            ${htmlTextTitle}
            <ul class="list-group mb-1">
              ${htmlTextBody}
            </ul>
          `,
        }).then(() => this.router.navigateByUrl('/home'));
      }
    });
  }
}
