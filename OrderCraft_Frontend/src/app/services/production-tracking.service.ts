import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for the schedule list (for the dropdown)
export interface ProductionSchedule {
  psId: number;
  status: string;
  product: {
    productsId: number;
    productsName: string;
  };
  // Add any other fields you might need from the schedule list
}

// Interface for the detailed tracking view
export interface ProductionTrackingDetails {
  psid: number;
  psproductid: number;
  productName: string;
  psstartdate: string;
  psenddate: string;
  psquantity: number;
  psstatus: string;
  currentStage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionTrackingService {
  private readonly BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  /**
   * Fetches all production schedules for the dropdown.
   * Corresponds to: GET /api/production-schedule
   */
  getAllSchedules(): Observable<ProductionSchedule[]> {
    return this.http.get<ProductionSchedule[]>(`${this.BASE_URL}/production-schedule`);
  }

  /**
   * Fetches the detailed tracking status for a given schedule ID.
   * Corresponds to: GET /api/production-tracking/{id}
   */
  getTrackingDetails(id: number): Observable<ProductionTrackingDetails> {
    return this.http.get<ProductionTrackingDetails>(`${this.BASE_URL}/production-tracking/${id}`);
  }
}
