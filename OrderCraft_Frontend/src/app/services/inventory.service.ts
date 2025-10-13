import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  productsId: number;
  productsName: string;
  productsDescription: string;
  category: { categoriesId: number; categoryName: string };
  productsUnitPrice: number;
  productsQuantity: number;
  productsImage: string;
  supplier: { suppliersId: number; suppliersName: string };
  minThreshold: number;
  maxThreshold: number;
  lastUpdated: string;
}

export interface InventoryTransaction {
  transactionId: number;
  product: Product;
  performedBy: any;
  transactionDate: string;
  transactionType: string;
  quantity: number;
}

export interface Category {
  categoriesId: number;
  categoryName: string;
}

export interface StockUpdateDTO {
  productId: number;
  quantity: number;
  transactionType: 'IN' | 'OUT';
}

export interface StockTrendPoint {
  date: string;       // yyyy-MM-dd
  stockLevel: number; // cumulative stock after this transaction
}

export interface MonthlyStockDTO {
  totalStock: any;
  month: string;
  totalQuantity: number; // net stock movement for that month
}
export interface NewPOOrder {
  orderId: number;
  userId: number;
  productId: number;
  productName: string;
  quantity: number;
  currentStock: number;
}

// --- Report DTOs ---
export interface InventoryReportFilterDTO {
  categoryId?: number;
  startDate?: string; // ISO string (yyyy-MM-dd)
  endDate?: string;
}

export interface StockReportDTO {
  productId: number;
  productName: string;
  categoryName: string;
  quantity: number;
}

export interface InventoryTransactionReportDTO {
  transactionId: number;
  productName: string;
  transactionType: string;
  quantity: number;
  transactionDate: string;
  performedBy: string;
}

export interface ProductionReportDTO {
  productionId: number;
  productName: string;
  quantityProduced: number;
  productionDate: string;
}

export interface ScheduledReportDTO {
  reportType: 'STOCK' | 'TRANSACTIONS' | 'PRODUCTION';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  format: 'PDF' | 'CSV';
  recipientEmail: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private baseUrl = 'http://localhost:8085/api/inventory';
  private reportsUrl = 'http://localhost:8085/api/reports';
  private productionUrl = 'http://localhost:8085/api/production_schedule';

  constructor(private http: HttpClient) {}

  /** Helper: JWT Authorization header */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // adjust based on your auth flow
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /** Get all products */
  getAllInventory(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  /** Get low stock products */
  getLowStock(threshold: number = 5): Observable<Product[]> {
    const params = new HttpParams().set('threshold', threshold.toString());
    return this.http.get<Product[]>(`${this.baseUrl}/low-stock`, { headers: this.getAuthHeaders(), params });
  }

  /** Get products by category */
  getByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${categoryId}`, { headers: this.getAuthHeaders() });
  }

  /** Search products by name */
  searchByName(name: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Product[]>(`${this.baseUrl}/search`, { headers: this.getAuthHeaders(), params });
  }

  /** Get transaction history for a product */
  getProductHistory(productId: number): Observable<InventoryTransaction[]> {
    return this.http.get<InventoryTransaction[]>(`${this.baseUrl}/history/${productId}`, { headers: this.getAuthHeaders() });
  }

  /** Update stock (IN/OUT) */
  updateStock(dto: StockUpdateDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-stock`, dto, { headers: this.getAuthHeaders() });
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`, { headers: this.getAuthHeaders() });
  }

  /** Get stock trend for a product (cumulative daily levels) */
  getProductStockTrend(productId: number): Observable<StockTrendPoint[]> {
    return this.http.get<StockTrendPoint[]>(`${this.baseUrl}/trend/${productId}`, { headers: this.getAuthHeaders() });
  }

  /** Get monthly stock aggregation for a product */
  getMonthlyStock(productId: number): Observable<MonthlyStockDTO[]> {
    return this.http.get<MonthlyStockDTO[]>(`${this.baseUrl}/monthly-stock/${productId}`, { headers: this.getAuthHeaders() });
  }

  getAllNewOrders(): Observable<NewPOOrder[]> {
    return this.http.get<NewPOOrder[]>(`${this.baseUrl}/new-orders`, {
      headers: this.getAuthHeaders(),
    });
  }

  /** ================= Inventory Reports ================= */

  /** Preview Stock Report */
  previewStockReport(filter: InventoryReportFilterDTO) {
    return this.http.post<StockReportDTO[]>(`${this.reportsUrl}/export/preview/stock`, filter, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Preview Transaction Report */
  previewTransactionReport(filter: InventoryReportFilterDTO) {
    return this.http.post<InventoryTransactionReportDTO[]>(`${this.reportsUrl}/export/preview/transactions`, filter, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Preview Production Report */
  previewProductionReport(filter: InventoryReportFilterDTO) {
    return this.http.post<ProductionReportDTO[]>(`${this.reportsUrl}/export/preview/production`, filter, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Export Stock Report (PDF or CSV) */
  exportStockReport(filter: InventoryReportFilterDTO, exportType: 'pdf' | 'csv') {
    return this.http.post(`${this.reportsUrl}/export/stock?exportType=${exportType}`, filter, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    });
  }

  /** Export Transaction Report (PDF or CSV) */
  exportTransactionReport(filter: InventoryReportFilterDTO, exportType: 'pdf' | 'csv') {
    return this.http.post(`${this.reportsUrl}/export/transactions?exportType=${exportType}`, filter, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    });
  }

  /** Export Production Report (PDF or CSV) */
  exportProductionReport(filter: InventoryReportFilterDTO, exportType: 'pdf' | 'csv') {
    return this.http.post(`${this.reportsUrl}/export/production?exportType=${exportType}`, filter, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    });
  }

  /** Schedule a report */
  scheduleReport(dto: ScheduledReportDTO) {
    return this.http.post(`${this.reportsUrl}/schedule`, dto, {
      headers: this.getAuthHeaders(),
    });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`, { headers: this.getAuthHeaders() });
  }

  /** Get all production statuses */
  getProductionStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.productionUrl}/statuses`, { headers: this.getAuthHeaders() });
  }


  getTransactionTypes(): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/transaction-types`, { headers: this.getAuthHeaders() });
}

  // ✅ ADDED: Schedule production API method
scheduleProduction(payload: any) {
  return this.http.post(`${this.productionUrl}/create`, payload, {
    headers: this.getAuthHeaders()
  });
}
}
