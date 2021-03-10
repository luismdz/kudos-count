import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { KudosComponent } from './pages/kudos/kudos.component';
import { SinParticipantesGuard } from './auth/sin-participantes.guard';
import { GuardarCambiosGuard } from './auth/guardar-cambios.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'kudos',
    component: KudosComponent,
    canActivate: [SinParticipantesGuard],
    canDeactivate: [GuardarCambiosGuard],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
