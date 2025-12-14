import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login';
import { NotificationService } from '../../account/services/notification/notification'; // Import Notification Service

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-password.html',
  styleUrl: './new-password.css',
})
export class NewPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  email: string = '';
  code: string = '';

  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private notificationService = inject(NotificationService); // Inject Service

  constructor() {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('resetEmail') || '';
    this.code = localStorage.getItem('resetCode') || '';

    if (!this.email || !this.code) {
      // Info Notification
      this.notificationService.showInfo('Session expired. Please start over.');
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('newPassword')?.value;

      const resetData = {
        email: this.email,
        code: this.code,
        newPassword: newPassword,
      };

      this.loginService.resetPassword(resetData).subscribe({
        next: (res) => {
          // Success Notification
          this.notificationService.showSuccess('Password reset successfully! You can now login.');

          localStorage.removeItem('resetEmail');
          localStorage.removeItem('resetCode');

          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          // Error Notification
          this.notificationService.showError('Failed to reset password.');
        },
      });
    }
  }
}
