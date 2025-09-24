

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8085/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Register user
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Update user by ID
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Delete user by ID
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Search users by username (optional usage)
  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search?username=${query}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get user by username
  getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/username/${username}`, {
      headers: this.getAuthHeaders()
    });
  }
}


