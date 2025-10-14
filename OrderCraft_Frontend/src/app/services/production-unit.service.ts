import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductionUnit {
  unitId: number;
  unitName: string;
  capacity: number;
  currentLoad: number;
  availabilityStatus: string;
  categoryId: number;
  currentProductId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionUnitService {
  private baseUrl = 'http://localhost:8085/api/units';

  constructor(private http: HttpClient) {}

  getUnits(): Observable<ProductionUnit[]> {
    return this.http.get<ProductionUnit[]>(this.baseUrl);
  }

  assignTask(categoryId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/assign`, null, {
      params: { categoryId, productId, quantity },
      responseType: 'text'
    });
  }

  completeTask(unitId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/complete/${unitId}`, null);
  }
}
