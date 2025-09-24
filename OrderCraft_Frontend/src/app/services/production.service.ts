import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionTimelineService {
  private baseUrl = 'http://localhost:8085/api/production';

  constructor(private http: HttpClient) {}

  getTimeline(filter: any): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // if JWT required
    });

    return this.http.post<any[]>(`${this.baseUrl}/timeline`, filter, { headers });
  }
}
