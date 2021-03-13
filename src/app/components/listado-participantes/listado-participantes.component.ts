import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Participante } from '../../interfaces/interfaces';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { firstLetterToUpperCase } from '../../utilidades';
import Swal from 'sweetalert2';
import { debounceTime, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-listado-participantes',
  templateUrl: './listado-participantes.component.html',
  styleUrls: ['./listado-participantes.component.css'],
})
export class ListadoParticipantesComponent implements OnInit, OnChanges {
  @Input() participantes: Participante[];
  @Output() agregarNuevo = new EventEmitter<Participante>();
  @Output() voto = new EventEmitter<Participante>();
  @Output() eliminar = new EventEmitter<Participante>();
  @Output() eliminarVoto = new EventEmitter<Participante>();

  private participantesOriginal = [];
  private debouncer = new Subject<string>();

  mensajes = '';
  formBuscador: FormGroup;
  formAgregar: FormGroup;

  get participante() {
    return this.formAgregar.get('participante');
  }

  get nombreBuscado() {
    return this.formBuscador.get('nombre');
  }

  mensaje = '';

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      nombre: '',
    });

    this.formAgregar = this.fb.group({
      participante: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    });

    this.formBuscador.valueChanges.subscribe(({ nombre }) => {
      // top 10 mas votados
      this.participantes = this.filtrarLista(nombre);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.participantes = changes.participantes.currentValue;
    this.participantesOriginal = this.participantes.slice();
    // Top 10 mas votados
    // this.participantes = this.participantes.slice(0, 5);
  }

  ngOnInit(): void {}

  filtrarLista(valor: string) {
    if (valor.length > 0) {
      const participantes = this.participantesOriginal;

      return participantes.filter(
        (p) =>
          p.nombre.toLocaleLowerCase().indexOf(valor.toLocaleLowerCase()) !== -1
      );
    }
    return this.participantesOriginal;
  }

  firstLetterToUpper() {
    if (
      this.participante.value.length > 0 &&
      this.participante.value.length === 1
    ) {
      this.participante.setValue(
        firstLetterToUpperCase(this.participante.value)
      );
    }
  }

  agregarParticipante() {
    const { participante } = this.formAgregar.value;

    this.agregarNuevo.emit({
      nombre: participante,
      votos: 0,
      mensajes: [],
    });

    this.formAgregar.reset();
  }

  // obtenerMensaje(mensaje: string) {
  //   this.mensaje = mensaje;
  // }

  votar(participante: Participante) {
    // participante.mensaje = '';
    this.voto.emit(participante);
    this.formBuscador.reset({
      nombre: '',
    });
  }

  onEliminarVoto(participante: Participante) {
    if (participante.votos === 0) {
      return;
    }

    Swal.fire({
      title: 'Eliminar voto?',
      text: `Se eliminará un voto a ${participante.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.isConfirmed) {
        this.eliminarVoto.emit(participante);

        this.formBuscador.reset({
          nombre: '',
        });
      }
    });
  }

  eliminarParticipante(participante: Participante) {
    Swal.fire({
      title: 'Eliminar Participante?',
      text: `Se eliminará a ${participante.nombre} de la lista`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.isConfirmed) {
        this.eliminar.emit(participante);

        this.formBuscador.reset({
          nombre: '',
        });
      }
    });
  }
}
