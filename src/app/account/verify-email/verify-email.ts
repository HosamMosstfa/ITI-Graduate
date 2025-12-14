import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register/register';
import { NotificationService } from '../../account/services/notification/notification'; // Import Notification Service

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css'],
})
export class VerifyEmailComponent implements OnInit {
  verifyForm: FormGroup;
  email: string = '';

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registerService = inject(RegisterService);
  private notificationService = inject(NotificationService); // Inject Service

  constructor() {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('pendingEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.verifyForm.patchValue({ email: this.email });
    }
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      const { email, code } = this.verifyForm.value;

      this.registerService.verifyEmailCode(email, code).subscribe({
        next: (res) => {
          // Success Notification
          this.notificationService.showSuccess('Account verified successfully!');

          localStorage.removeItem('pendingEmail');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Verification Failed', err);
          // Error Notification
          this.notificationService.showError('Invalid code or email. Please try again.');
        },
      });
    } else {
      this.verifyForm.markAllAsTouched();
    }
  }

  resendCode() {
    const emailToResend = this.verifyForm.get('email')?.value;

    if (emailToResend) {
      this.registerService.resendVerificationCode(emailToResend).subscribe({
        next: (res) => {
          // Success Notification
          this.notificationService.showSuccess('Verification code resent to your email.');
        },
        error: (err) => {
          console.error('Resend Failed', err);
          // Error Notification
          this.notificationService.showError('Failed to resend code.');
        },
      });
    } else {
      // Info Notification
      this.notificationService.showInfo('Please ensure the email field is filled.');
    }
  }
}
