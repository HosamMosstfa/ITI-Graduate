import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register/register';
import { NotificationService } from '../services/notification/notification';

@Component({
  selector: 'app-complete-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complete-registration.html',
  styleUrls: ['./complete-registration.css'],
})
export class CompleteRegistration {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  completeForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  activityLevels = [
    { label: 'Sedentary (Little or no exercise)', value: 1.2 },
    { label: 'Lightly Active (1-3 days/week)', value: 1.375 },
    { label: 'Moderately Active (3-5 days/week)', value: 1.55 },
    { label: 'Very Active (6-7 days/week)', value: 1.725 },
    { label: 'Extra Active (Physical job)', value: 1.9 },
  ];

  constructor() {
    this.completeForm = this.fb.group({
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(500)]],
      activityLevel: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.completeForm.invalid) {
      this.completeForm.markAllAsTouched();
      this.notificationService.showError('Please fill out all required fields correctly.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const val = this.completeForm.value;

    this.registerService
      .addCustomer(
        val.birthDate,
        val.gender,
        Number(val.weight),
        Number(val.height),
        Number(val.activityLevel)
      )
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Profile completed successfully!');
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          const errorMsg =
            err.error?.message || 'An error occurred while saving data. Please try again.';
          this.errorMessage = errorMsg;
          this.notificationService.showError(errorMsg);
        },
      });
  }
}
