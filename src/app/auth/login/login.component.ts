import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService, User } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  // getters
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {}

  login() {
    const user: User = this.form.value;

    this.authSvc
      .loginWithEmail(user)
      .then(() => this.router.navigateByUrl('/home'));
  }

  GoogleSignIn() {
    this.authSvc
      .loginWithGoogle()
      .then(() => this.router.navigateByUrl('/home'));
  }
}
