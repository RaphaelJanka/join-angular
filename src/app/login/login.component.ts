import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  authForm!: FormGroup;
  isLoggedIn: boolean = false;
  errorMessage: Message[] = [];
  loginSubscription!: Subscription | undefined;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    const email = this.authForm.value.username;
    const password = this.authForm.value.password;
    this.authService.isLoading = true;
    this.loginSubscription = this.authService.login(email, password).subscribe({
      next: () => {
        this.authService.isLoading = false;
      },
      error: (errorMessage) => {
        this.errorMessage = [
          { severity: 'error', summary: 'Error', detail: errorMessage },
        ];
        this.authService.isLoading = false;
      },
    });
  }

  onGuestLogin() {}

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe()
  }
}
