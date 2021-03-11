import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';

export interface User {
  uid?: string;
  displayName?: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User;
  googleProvider = new firebase.auth.GoogleAuthProvider();

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user) => (this.currentUser = user));
  }

  async loginWithEmail({ email, password }: User) {
    const resp = this.afAuth.signInWithEmailAndPassword(email, password);

    console.log(resp);
  }

  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const resp = await this.afAuth.signInWithPopup(provider);
      return resp.user;
    } catch (e) {
      console.log(e);
    }
  }

  async registerWithEmail({ email, password }: User) {
    try {
      const resp = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      return resp.user;
    } catch (e) {
      console.log(e);
    }
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigateByUrl('/home');
  }
}
