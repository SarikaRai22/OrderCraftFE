import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private baseUrl = 'http://localhost:8085/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  //  hasActiveSchedule(productId: number): Observable<boolean> {
  //   return this.http.get<boolean>(`${this.baseUrl}/${productId}/active-schedule`);
  // }
  hasActiveSchedule(productId: number): Observable<boolean> {
  return this.http.get<boolean>(`http://localhost:8085/api/production/hasOpenOrder/${productId}`);
}


}
