import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraficoBarrasHorizontalComponent } from './grafico-barras-horizontal/grafico-barras-horizontal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SelectorParticipantesComponent } from './selector-participantes/selector-participantes.component';
import { ListadoParticipantesComponent } from './listado-participantes/listado-participantes.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    GraficoBarrasHorizontalComponent,
    NavbarComponent,
    SelectorParticipantesComponent,
    ListadoParticipantesComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
  ],
  exports: [
    GraficoBarrasHorizontalComponent,
    NavbarComponent,
    SelectorParticipantesComponent,
    ListadoParticipantesComponent,
    FooterComponent,
  ],
})
export class ComponentsModule {}
