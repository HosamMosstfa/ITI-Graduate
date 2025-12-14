import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login';
import { NotificationService } from '../../account/services/notification/notification'; // Import Notification Service

@Component({
  selector: 'app-reset-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-code.html',
  styleUrl: './reset-code.css',
})
export class ResetCodeComponent implements OnInit {
  codeForm: FormGroup;
  email: string = '';

  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private notificationService = inject(NotificationService); // Inject Service

  constructor() {
    this.codeForm = this.fb.group({
      code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('resetEmail') || '';
    if (!this.email) {
      // Info Notification
      this.notificationService.showInfo('لم يتم العثور على بريد إلكتروني. يرجى المحاولة من جديد.');
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit() {
    if (this.codeForm.valid) {
      const code = this.codeForm.get('code')?.value;

      this.loginService.verifyResetCode(this.email, code).subscribe({
        next: (res) => {
          localStorage.setItem('resetCode', code);

          // Success Notification
          this.notificationService.showSuccess('تم التحقق من الرمز بنجاح.');

          this.router.navigate(['/new-password']);
        },
        error: (err) => {
          console.error(err);
          // Error Notification
          this.notificationService.showError('الرمز غير صحيح.');
        },
      });
    }
  }
}
