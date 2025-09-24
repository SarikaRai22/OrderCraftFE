import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8085/api/orders';

  constructor(private http: HttpClient) {}


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }


  createProductOrder(orderPayload: any): Observable<any> {
    const token = localStorage.getItem('token'); // token must be stored here
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post(`${this.baseUrl}/create-product`, orderPayload, { headers });
  }

  createRawMaterialOrder(rawMaterialPayload: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });

  return this.http.post(`${this.baseUrl}/create-rawmaterial`, rawMaterialPayload, { headers });
}


getRawMaterialsByProduct(productId: number): Observable<any> {
  return this.http.get(`http://localhost:8085/api/products/by-product/${productId}`);
}

getAllProducts(): Observable<any> {
  return this.http.get('http://localhost:8085/api/products');
}


getAllSuppliers() {
  return this.http.get<any[]>('http://localhost:8085/api/suppliers'); // Adjust the URL if needed
}

getAllOrders(): Observable<any[]> {
  const token = localStorage.getItem('token'); // ✅ Get JWT from localStorage
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token // ✅ Add Authorization header
  });

  return this.http.get<any[]>('http://localhost:8085/api/orders/my-orders', { headers });
}



// updateOrder(orderId: number, newDate: string, updatedItems: any[]): Observable<any> {
//   const token = localStorage.getItem('token');
//   const headers = new HttpHeaders({
//     'Authorization': 'Bearer ' + token,
//     'Content-Type': 'application/json'
//   });

//   return this.http.put(`http://localhost:8085/api/orders/update/${orderId}`, {
//     expectedDeliveryDate: newDate,
//     items: updatedItems
//   }, { headers });
// }



updateProductOrder(orderId: number, newDate: string, updatedItems: any[]): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  });

  return this.http.put(`http://localhost:8085/api/orders/update-product-order/${orderId}`, {
    poExpectedDeliveryDate: newDate,
    items: updatedItems
  }, { headers });
}

updateRawMaterialOrder(orderId: number, newDate: string, updatedItems: any[]): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  });

  return this.http.put(`http://localhost:8085/api/orders/update-raw-material-order/${orderId}`, {
    poExpectedDeliveryDate: newDate,
    items: updatedItems
  }, { headers });
}




cancelOrder(orderId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  });

  return this.http.put(`http://localhost:8085/api/orders/cancel/${orderId}`, {}, { headers,responseType: 'text' });
}


//Return Order
returnOrder(dto: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  });
  return this.http.post('http://localhost:8085/api/orders/return-orders', dto, { headers });
}



// ✅ Get current tracking status (for horizontal tracker)
  getTrackingStatus(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tracking-status/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }


  // ✅ (Optional) Get expected delivery date
  getExpectedDeliveryDate(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/expected-delivery/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }


  // ✅ Add this to OrderService
  getAllOrderIds(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:8085/api/orders/order-ids', {
      headers: this.getAuthHeaders()
    });
  }


  getCustomersByEmail(email: string): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  });
  return this.http.get<any[]>(`http://localhost:8085/api/customers/search?email=${email}`, { headers });
}




// order.service.ts
getInvoicePdf(orderId: number): Observable<Blob> {
  const token = localStorage.getItem('token'); // get JWT token stored after login
  const headers = {
    Authorization: `Bearer ${token}`
  };
  return this.http.get(`http://localhost:8085/api/orders/invoice/${orderId}/pdf`, { 
    headers, 
    responseType: 'blob' 
  });
}


}
