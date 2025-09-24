import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
 
interface Alert {
  id: string;
  message: string;
  productId: number;
  productName: string;
  minThreshold: number;
  maxThreshold: number;
  currentStock: number;
  caseType: string;
  restockQuantity: number;
  status: string;
  read: boolean;
  timestamp: Date;
}
 
@Component({
  selector: 'app-im-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './im-dashboard-layout.component.html',
  styleUrl: './im-dashboard-layout.component.scss'
})
export class ImDashboardLayoutComponent implements OnInit {
  // Profile dropdown
  profileMode: 'view' | 'edit' | null = null;
  dropdownOpen = false;
 
  // Notifications
  notificationsOpen = false;
  alerts: Alert[] = [];
  unreadAlertsCount = 0;
  isLoading = false;
  errorMessage = '';
 
  // Constants
  private readonly READ_ALERTS_KEY = 'readAlerts';
  private readonly API_BASE_URL = 'http://localhost:8085';
 
  constructor(private router: Router, private http: HttpClient) {}
 
  ngOnInit() {
    this.loadAlerts();
    // Refresh alerts every 5 minutes
    setInterval(() => this.loadAlerts(), 300000);
  }
 
  /** ---------------- DROPDOWN ---------------- **/
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
 
  closeDropdown() {
    setTimeout(() => (this.dropdownOpen = false), 150);
  }
 
  /** ---------------- NOTIFICATIONS ---------------- **/
  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
    if (this.notificationsOpen) {
      this.loadAlerts();
    }
  }
 
  closeNotifications() {
    setTimeout(() => (this.notificationsOpen = false), 150);
  }
 
  loadAlerts() {
    this.isLoading = true;
    this.errorMessage = '';
 
    const token = localStorage.getItem('token');
 
    if (!token) {
      this.errorMessage = 'No authentication token found. Please login again.';
      this.isLoading = false;
      this.updateUnreadCount();
      return;
    }
 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
 
    this.http.get<any>(`${this.API_BASE_URL}/api/replenish/alerts`, { headers }).subscribe({
      next: (response) => this.processResponse(response),
      error: (error) => {
        if (error.status === 403) {
          this.handleAuthError();
        } else {
          this.handleError(error);
        }
        this.isLoading = false;
        this.updateUnreadCount();
      }
    });
  }
 
  private processResponse(response: any) {
    let alertsArray: any[] = [];
 
    if (Array.isArray(response)) {
      alertsArray = response;
    } else if (response && typeof response === 'object') {
      if (Array.isArray(response.alerts)) {
        alertsArray = response.alerts;
      } else if (Array.isArray(response.data)) {
        alertsArray = response.data;
      } else if (Array.isArray(response.items)) {
        alertsArray = response.items;
      } else if (response.productId) {
        alertsArray = [response];
      }
    }
 
    const readAlerts = this.getReadAlerts();
 
    this.alerts = alertsArray.map((alert) => {
      const alertId = this.generateAlertId(alert);
      const isRead = readAlerts.includes(alertId);
 
      return {
        id: alertId,
        message: alert.message || 'Stock Alert',
        productId: alert.productId || 0,
        productName: alert.productName || 'Unknown Product',
        minThreshold: alert.minThreshold || 0,
        maxThreshold: alert.maxThreshold || 0,
        currentStock: alert.currentStock || 0,
        caseType: alert.caseType || 'LOW_STOCK',
        restockQuantity: alert.restockQuantity || 0,
        status: alert.status || 'NEW',
        read: isRead,
        timestamp: new Date()
      };
    });
 
    this.updateUnreadCount();
    this.isLoading = false;
 
    this.errorMessage = this.alerts.length === 0 ? 'No stock alerts found' : '';
  }
 
  private generateAlertId(alert: any): string {
    return `${alert.productId}-${alert.currentStock}-${alert.minThreshold}-${alert.maxThreshold}`;
  }
 
  private handleAuthError() {
    this.errorMessage = 'Authentication failed. Please login again.';
    setTimeout(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, 3000);
  }
 
  private handleError(error: any): void {
    if (error.status === 0) {
      this.errorMessage = 'Cannot connect to server. Please check if backend is running.';
    } else if (error.status === 401) {
      this.errorMessage = 'Authentication required. Please login again.';
      this.handleAuthError();
    } else if (error.status === 404) {
      this.errorMessage = 'Alerts endpoint not found.';
    } else if (error.status === 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else {
      this.errorMessage = `Failed to load alerts: ${error.status}`;
    }
  }
 
  markAllAsRead() {
    const readAlerts = this.getReadAlerts();
 
    this.alerts.forEach((alert) => {
      if (!readAlerts.includes(alert.id)) {
        readAlerts.push(alert.id);
      }
      alert.read = true;
    });
 
    this.saveReadAlerts(readAlerts);
    this.updateUnreadCount();
 
    this.errorMessage = 'All alerts marked as read';
    setTimeout(() => (this.errorMessage = ''), 2000);
  }
 
  private getReadAlerts(): string[] {
    const readAlertsJson = localStorage.getItem(this.READ_ALERTS_KEY);
    return readAlertsJson ? JSON.parse(readAlertsJson) : [];
  }
 
  private saveReadAlerts(readAlerts: string[]): void {
    localStorage.setItem(this.READ_ALERTS_KEY, JSON.stringify(readAlerts));
  }
 
  updateUnreadCount() {
    this.unreadAlertsCount = this.alerts.filter((alert) => !alert.read).length;
  }
 
  /** ---------------- PROFILE & ROUTING ---------------- **/
  openProfile(mode: 'view' | 'edit'): void {
    const path = mode === 'view' ? 'user-profile' : 'edit-profile';
    this.router.navigate([`/im-dashboard/${path}`]);
    this.dropdownOpen = false;
  }
 
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(this.READ_ALERTS_KEY);
    window.location.href = '/login'; // full reload
  }
 
  goToDashboard(): void {
    this.router.navigate(['/im-dashboard']);
  }
}
 