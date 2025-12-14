import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register/register';

@Component({
  selector: 'app-complete-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complete-registration.html',
  styleUrls: ['./complete-registration.css'],
})
export class CompleteRegistration {
  // Injections
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);

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
          console.log('Success:', res);
          this.isSubmitting = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error:', err);
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Something went wrong. Please check your data.';
        },
      });
  }
}
