import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private http = inject(HttpClient);

  private usersUrl = 'http://localhost:8888/api/Users';

  private customersUrl = 'http://localhost:8888/api/Customers';

  // ----------------- Auth Methods -----------------

  // 1. Register New User
  registerUser(userData: any): Observable<any> {
    userData.role = 'Customer';
    return this.http.post(`${this.usersUrl}/register`, userData);
  }

  // 2. Verify Email Code
  verifyEmailCode(email: string, code: string): Observable<any> {
    const body = { email, code };
    return this.http.post(`${this.usersUrl}/verify-email-code`, body);
  }

  // 3. Resend Verification Code
  resendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/resend-code-Verification`, JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ----------------- Profile Methods -----------------

  addCustomer(
    birthDate: string,
    gender: string,
    weight: number,
    height: number,
    activityLevel: number
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      birthDate: birthDate,
      gender: gender,
      weight: weight,
      height: height,
      activityLevel: activityLevel,
    };

    return this.http.post(`${this.customersUrl}/addCustomer`, body, { headers });
  }
}
