import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../services/login/login';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../account/services/notification/notification'; // Import Notification Service

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private notificationService = inject(NotificationService); // Inject Service

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.notificationService.showSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...');

          localStorage.setItem('token', res.token);

          setTimeout(() => {
            this.router.navigate(['/complete-registration']);
          }, 1000);
        },
        error: (err) => {
          console.error('Login Failed', err);
          const errorMsg = err.error?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
          this.notificationService.showError(errorMsg);
        },
      });
    }
  }
}
