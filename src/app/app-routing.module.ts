import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { KudosComponent } from './pages/kudos/kudos.component';
import { SinParticipantesGuard } from './auth/guards/sin-participantes.guard';
import { GuardarCambiosGuard } from './auth/guards/guardar-cambios.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'kudos',
    component: KudosComponent,
    canActivate: [SinParticipantesGuard],
    canDeactivate: [GuardarCambiosGuard],
  },
  // {
  //   path: 'auth',
  //   loadChildren: () =>
  //     import('./auth/auth-routing.module').then((m) => m.AuthRoutingModule),
  // },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
