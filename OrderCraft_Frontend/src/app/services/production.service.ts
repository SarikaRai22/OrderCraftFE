import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for Production Unit
export interface ProductionUnit {
  unitId: number;
  unitName: string;
  categoryId: number;
  capacity: number;
  currentLoad: number;
  currentProductId: number | null;
  availabilityStatus: string;
}


// Interface for Production Request DTO
export interface ViewProductionRequestDTO {
  product: any; // you can replace 'any' with a proper Product interface if available
  productName: string | null;
  quantity: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionTimelineService {
  // base URLs for your production endpoints
  private productionBaseUrl = 'http://localhost:8085/api/production';
  private unitBaseUrl = 'http://localhost:8085/api/units'; // for task assignment endpoints

  constructor(private http: HttpClient) {}

  // 🧩 COMMON HEADER (with JWT if required)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  // 📊 1. Get Production Timeline (existing)
  getTimeline(filter: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.productionBaseUrl}/timeline`, filter, {
      headers: this.getHeaders()
    });
  }

  // 🏭 2. Assign Task to Production Unit
  // 🏭 2. Assign Task to Production Unit
assignTask(categoryId: number, productId: number, quantity: number): Observable<ProductionUnit> {
  
    const params = new HttpParams()
  .set('categoryId', categoryId.toString())
  .set('productId', productId.toString())
  .set('quantity', quantity.toString());


  // ✅ Updated POST with withCredentials
  return this.http.post<ProductionUnit>(`${this.unitBaseUrl}/assign`, {}, {
    headers: this.getHeaders(),
    params,
    withCredentials: true
  });
}


  // ✅ 3. Complete Task for a Unit
  completeTask(unitId: number): Observable<void> {
    return this.http.post<void>(`${this.unitBaseUrl}/complete/${unitId}`, {}, {
      headers: this.getHeaders()
    });
  }

  // 📋 4. (Optional) Get All Production Units (if you add such an endpoint)
  getAllUnits(): Observable<ProductionUnit[]> {
    return this.http.get<ProductionUnit[]>(`${this.unitBaseUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  // 🧮 5. (Optional) Get Single Unit by ID (for status view)
  getUnitById(unitId: number): Observable<ProductionUnit> {
    return this.http.get<ProductionUnit>(`${this.unitBaseUrl}/${unitId}`, {
      headers: this.getHeaders()
    });
  }

    // 🆕 6. View All Production Requests
  viewProductionRequests(): Observable<ViewProductionRequestDTO[]> {
    return this.http.get<ViewProductionRequestDTO[]>(`${this.productionBaseUrl}/view-requests`, {
      headers: this.getHeaders()
    });
  }
}
