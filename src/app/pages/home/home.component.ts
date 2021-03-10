import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KudosService } from '../../services/kudos.service';
import { Participante } from '../../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private kudosSvc: KudosService, private router: Router) {}

  ngOnInit(): void {}

  obtenerParticipantes(participantes: Participante[]) {
    if (participantes !== null && participantes.length > 0) {
      this.kudosSvc.agregarListaParticipantes(participantes);
      this.router.navigateByUrl('/kudos');
    }
  }
}
