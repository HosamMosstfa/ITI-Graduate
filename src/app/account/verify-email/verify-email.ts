import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register/register';
import { NotificationService } from '../../account/services/notification/notification';

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
  private notificationService = inject(NotificationService);

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
          this.notificationService.showSuccess('تم تفعيل الحساب بنجاح! الرجاء تسجيل الدخول.');
          localStorage.removeItem('pendingEmail');

          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Verification Failed', err);
          this.notificationService.showError('الرمز أو البريد غير صحيح. حاول مرة أخرى.');
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
          this.notificationService.showSuccess('تم إعادة إرسال رمز التحقق إلى بريدك.');
        },
        error: (err) => {
          console.error('Resend Failed', err);
          this.notificationService.showError('فشل في إعادة إرسال الرمز.');
        },
      });
    } else {
      this.notificationService.showInfo('يرجى التأكد من ملء حقل البريد الإلكتروني.');
    }
  }
}
