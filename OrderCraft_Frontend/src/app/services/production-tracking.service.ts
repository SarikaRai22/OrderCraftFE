import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ✅ Matches your backend response DTO
export interface ProductionScheduleTrackingResponse {
  scheduleId: number;
  productId: number;
  productName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: string;
  actions: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionTrackingService {
  private readonly BASE_URL = 'http://localhost:8085/api/production-tracking'; // ✅ Your backend port

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // ✅ Fetch all production schedules
  getAllSchedules(): Observable<ProductionScheduleTrackingResponse[]> {
    return this.http
      .get<ProductionScheduleTrackingResponse[]>(this.BASE_URL, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ Fetch tracking details by ID
  getTrackingDetails(id: number): Observable<ProductionScheduleTrackingResponse> {
    return this.http
      .get<ProductionScheduleTrackingResponse>(`${this.BASE_URL}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ Update actions (RECEIVED or NOT_RECEIVED)
  updateAction(id: number, action: string): Observable<string> {
    return this.http
      .put(`${this.BASE_URL}/${id}/actions?action=${action}`, {}, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('❌ API Error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
