import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../services/register/register';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../account/services/notification/notification'; // Import Notification Service

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);
  private notificationService = inject(NotificationService); // Inject Service

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.registerService.registerUser(this.registerForm.value).subscribe({
        next: (res) => {
          // Success Notification
          this.notificationService.showSuccess('تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني.');
          localStorage.setItem('pendingEmail', this.registerForm.get('email')?.value);
          this.router.navigate(['/verify-email']);
        },
        error: (err) => {
          console.error('Full Error Object:', err);

          // Handle Error Message Logic
          let errorMessage = 'فشل التسجيل.';

          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error?.title) {
            errorMessage = err.error.title;
          } else if (err.statusText) {
            errorMessage = err.statusText;
          }

          // Error Notification
          this.notificationService.showError(errorMessage);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
