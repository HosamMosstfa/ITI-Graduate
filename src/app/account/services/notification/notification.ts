import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  // 1. Success Toast (Small notification in the corner)
  showSuccess(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end', // Top right corner
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: 'success',
      title: message,
    });
  }

  // 2. Error Popup (Centered modal)
  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#22c55e', // Matches your primary green color
    });
  }

  // 3. Info/Warning Toast
  showInfo(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'info',
      title: message,
    });
  }
}
