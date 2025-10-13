// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductionScheduleService {

//   private baseUrl = 'http://localhost:8080/api/production_schedule'; // adjust your backend URL

//   constructor(private http: HttpClient) {}

//   getProducts(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/products`);
//   }

//   getSchedules(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/schedules`);
//   }

//   createSchedule(request: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/create`, request);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionScheduleService {

  private baseUrl = 'http://localhost:8085/api/production_schedule'; // ✅ backend production schedule base
  private productsUrl = 'http://localhost:8085/api/products';        // ✅ correct product base

  constructor(private http: HttpClient) {}

  // 🔐 Helper to add JWT in headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** ✅ Get all products (from ProductController) */
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.productsUrl, { headers: this.getAuthHeaders() });
  }

  /** ✅ Get all production schedules */
  getSchedules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  /** ✅ Create a new production schedule */
  createSchedule(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/schedule`, request, { headers: this.getAuthHeaders() });
  }

  /** ✅ Check raw materials sufficiency */
  checkRawMaterials(productId: number, quantity: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/check-raw-materials?productId=${productId}&quantity=${quantity}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** ✅ Reserve raw materials */
  reserveRawMaterials(productId: number, quantity: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reserve-raw-materials`,
      { productId, quantity },
      { headers: this.getAuthHeaders() }
    );
  }

  /** ✅ Check if product already has an open order */
  hasOpenOrder(productId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/hasOpenOrder/${productId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
