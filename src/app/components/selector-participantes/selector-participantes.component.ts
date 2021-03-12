import { Component, Output, EventEmitter } from '@angular/core';
import { Participante } from '../../interfaces/interfaces';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'selector-participantes',
  templateUrl: './selector-participantes.component.html',
  styleUrls: ['./selector-participantes.component.css'],
})
export class SelectorParticipantesComponent {
  @Output() participantesElegidos = new EventEmitter<Participante[]>();
  form: FormGroup;
  private participantes: Participante[];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      participantes: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    const participantesArr = this.form.value.participantes.split('\n');

    this.participantes = participantesArr
      .filter((x: string) => x !== '')
      .map((nombre: string, index: number) => ({ id: index, nombre, votos: 0, mensajes: [] }));

    this.participantesElegidos.emit(this.participantes);
  }
}
