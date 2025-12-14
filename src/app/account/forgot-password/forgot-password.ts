import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../services/login/login';
import { NotificationService } from '../../account/services/notification/notification'; // Import Notification Service

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private notificationService = inject(NotificationService); // Inject Service

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.get('email')?.value;

      this.loginService.forgotPassword(email).subscribe({
        next: (res) => {
          localStorage.setItem('resetEmail', email);

          // Success Notification
          this.notificationService.showSuccess('Reset code sent to your email.');

          this.router.navigate(['/reset-code']);
        },
        error: (err) => {
          console.error(err);
          // Error Notification
          this.notificationService.showError('Error sending code. Please check the email.');
        },
      });
    }
  }
}
