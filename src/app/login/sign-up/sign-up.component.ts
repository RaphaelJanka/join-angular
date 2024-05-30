import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Message } from 'primeng/api';

export function passwordMatchValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (control && matchingControl && control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordMismatch: true });
    } else {
      matchingControl?.setErrors(null);
    }
    return null;
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  errorMessage: Message[] = [];

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        firstname: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
        passwordMatch: new FormControl(null, [Validators.required]),
      },
      { validators: passwordMatchValidator('password', 'passwordMatch') }
    );
  }

  onSubmit() {
    if (!this.signUpForm.valid) {
      return;
    }
    this.authService.isLoading = true;
    const name = this.signUpForm.value.firstname + ' ' + this.signUpForm.value.lastname;
    // const firstname = this.signUpForm.value.firstname;
    // const lastname = this.signUpForm.value.lastname;
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.passwordMatch;
    this.authService.signUp(email, password, name).subscribe({
      next: () => {
        this.router.navigate(['/summary']);
        this.signUpForm.reset();
      },
      error: (errorMessage) => {
        this.errorMessage = [
          { severity: 'error', summary: 'Error', detail: errorMessage },
        ];
        this.authService.isLoading = false;
      },
      complete: () => {
        this.authService.isLoading = false;
      },
    });
  }
}
