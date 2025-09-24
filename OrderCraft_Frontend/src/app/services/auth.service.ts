import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8085/auth';

  constructor(private http: HttpClient) {}

  // login(data: { username: string; password: string }) {
  //   return this.http.post<{ token: string }>(`${this.baseUrl}/login`, data);
  // }

  // login(credentials: { username: string; password: string; captcha?: string | null }) {
  //   return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  // }

  login(credentials: { username: string; password: string; captchaToken: string | null }) {
    return this.http.post<{ token: string; roles: string[] }>(`${this.baseUrl}/login`, credentials);
  }

  requestOtp(email: string) {
    return this.http.post(`${this.baseUrl}/forgot-password/request-otp`, { email });
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post(`${this.baseUrl}/forgot-password/verify-otp`, { email, otp });
  }

  resetPassword(email: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/forgot-password/reset`, { email, newPassword });
  }


  getDecodedToken(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode<any>(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }


   getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.roles) return [];
    
    // ✅ Strip "ROLE_" prefix
    return decoded.roles.map((r: string) => r.replace('ROLE_', ''));
  }


   hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

}
