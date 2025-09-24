import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  categoriesId: number;
  categoryName: string;
}

export interface Product {
  productsId: number;
  productsName: string;
  productsDescription: string;
  productsUnitPrice: number;
  productsQuantity: number;
  productsImage?: string;
  category?: Category;
}

export interface ProductDTO {
  productsName: string;
  productsDescription: string;

  unitPrice?: number | null;   // ✅ allow null
  quantity?: number | null;    // ✅ allow null
  image?: string;
  categoryId?: number;   // ✅ should be number, not string
  newCategoryName?: string;
}


export interface CategoryDTO {
  categoryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductCategorizationService {
  private baseUrl = 'http://localhost:8085/api/inventory';

  constructor(private http: HttpClient) {}

  /** Utility to attach Authorization header */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // -------- Category APIs --------
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`, {
      headers: this.getAuthHeaders()
    });
  }

  addCategory(dto: CategoryDTO): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  updateCategory(id: number, dto: CategoryDTO): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCategory(categoriesId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/category/${categoriesId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  // -------- Product APIs --------
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${categoryId}/products`, {
      headers: this.getAuthHeaders()
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/product/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  addProduct(dto: ProductDTO): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/create-product`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  updateProduct(id: number, dto: ProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProduct(productsId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/product/${productsId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
  
}
