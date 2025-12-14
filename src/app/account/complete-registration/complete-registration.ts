import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer/customer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.html',
  styleUrls: ['./complete-registration.css'],
})
export class CompleteRegistrationComponent {
  completeForm: FormGroup;

  // Activity Levels (English) matching your logic
  activityLevels = [
    { label: 'Sedentary (Little or no exercise)', value: 1.2 },
    { label: 'Lightly Active (Light exercise 1-3 days/week)', value: 1.375 },
    { label: 'Moderately Active (Moderate exercise 3-5 days/week)', value: 1.55 },
    { label: 'Very Active (Hard exercise 6-7 days/week)', value: 1.725 },
    { label: 'Extra Active (Very hard exercise & physical job)', value: 1.9 },
  ];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {
    // Form matches the Swagger Request Body keys exactly
    this.completeForm = this.fb.group({
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(500)]],
      activityLevel: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.completeForm.valid) {
      this.customerService.addCustomer(this.completeForm.value).subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Profile Completed!',
            text: 'Your data has been saved successfully.',
            icon: 'success',
            confirmButtonText: 'Go to Home',
            confirmButtonColor: '#22c55e', // Matching your primary-500 color
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/home']);
            }
          });
        },
        error: (err) => {
          console.error('API Error:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong while saving your data.',
            icon: 'error',
            confirmButtonText: 'Try Again',
            confirmButtonColor: '#ef4444',
          });
        },
      });
    } else {
      this.completeForm.markAllAsTouched();
    }
  }
}
