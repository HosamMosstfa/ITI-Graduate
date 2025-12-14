import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8888/api/Users';

  // 1. Login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // 2. Forgot Password (Initiate)
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Verify Reset Code
  verifyResetCode(email: string, code: string): Observable<any> {
    const body = { email, code };
    return this.http.post(`${this.baseUrl}/reset-code-Verification`, body);
  }

  // 4. Reset Password (New Password)
  resetPassword(data: any): Observable<any> {
    // data should contain: { email, newPassword, code }
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }
}
