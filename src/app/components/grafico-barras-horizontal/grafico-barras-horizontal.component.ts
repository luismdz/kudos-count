import { Votacion, Participante } from '../../interfaces/interfaces';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'grafico-barras-horizontal',
  templateUrl: './grafico-barras-horizontal.component.html',
  styleUrls: ['./grafico-barras-horizontal.component.css'],
})
export class GraficoBarrasHorizontalComponent implements OnInit {
  @Input() datos: any[] = [];
  loaded = false;

  // options
  yAxisLabel: string = 'Participantes';
  xAxisLabel: string = 'Votos';
  colorScheme = 'cool';
  roundEdges = false;

  constructor() {}

  ngOnInit(): void {}
}
