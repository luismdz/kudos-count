import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { KudosComponent } from './pages/kudos/kudos.component';
import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent, HomeComponent, KudosComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentsModule,
    AngularFireModule.initializeApp(
      environment.firebase,
      'angular-auth-firebase'
    ),
    AngularFirestoreModule,
    AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
