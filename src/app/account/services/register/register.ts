import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8888/api/Users';

  // 1. Register New User
  registerUser(userData: any): Observable<any> {
    // Ensuring the role is always "Customer" as per requirements
    userData.role = 'Customer';
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  // 2. Verify Email Code
  verifyEmailCode(email: string, code: string): Observable<any> {
    const body = { email, code };
    return this.http.post(`${this.baseUrl}/verify-email-code`, body);
  }

  // 3. Resend Verification Code
  // Note: Based on Swagger, it takes a string. We send it as JSON string or raw string depending on backend config.
  // Usually .NET accepts object keys, but if it's strictly [FromBody] string, we send it like this:
  resendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-code-Verification`, JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
