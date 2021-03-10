import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraficoBarrasHorizontalComponent } from './grafico-barras-horizontal/grafico-barras-horizontal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SelectorParticipantesComponent } from './selector-participantes/selector-participantes.component';
import { ListadoParticipantesComponent } from './listado-participantes/listado-participantes.component';

@NgModule({
  declarations: [
    GraficoBarrasHorizontalComponent,
    NavbarComponent,
    SelectorParticipantesComponent,
    ListadoParticipantesComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxChartsModule],
  exports: [
    GraficoBarrasHorizontalComponent,
    NavbarComponent,
    SelectorParticipantesComponent,
    ListadoParticipantesComponent,
  ],
})
export class ComponentsModule {}
