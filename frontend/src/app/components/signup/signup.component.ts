import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      adminKey: ['']
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.signupForm.value;
    const signupData: any = {
      email: formValue.email,
      password: formValue.password
    };

    if (formValue.adminKey) {
      signupData.adminKey = formValue.adminKey;
    }

    this.authService.signup(signupData).subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.errorHandler.showSuccess('Signup successful');
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }
}

