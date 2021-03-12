import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KudosService } from '../../services/kudos.service';
import { Participante } from '../../interfaces/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  codigoInput: FormGroup;
  codigoInvalido = false;

  get codigo() {
    return this.codigoInput.get('codigo');
  }

  constructor(private kudosSvc: KudosService, private router: Router) {
    this.kudosSvc.finalizado$.next(false);

    this.codigoInput = new FormGroup({
      codigo: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {}

  obtenerParticipantes(participantes: Participante[]) {
    if (participantes !== null && participantes.length > 0) {
      this.kudosSvc.agregarListaParticipantes(participantes);
      this.router.navigateByUrl('/kudos');
    }
  }

  async validarCodigo() {
    if (this.codigo !== null && this.codigo.value.length === 8) {
      const esValido = await this.kudosSvc.obtenerVotacionPorCodigo(
        this.codigo.value
      );

      if (!esValido) {
        this.codigoInvalido = true;
      } else {
        this.router.navigateByUrl('/kudos');
      }
    }
  }
}
