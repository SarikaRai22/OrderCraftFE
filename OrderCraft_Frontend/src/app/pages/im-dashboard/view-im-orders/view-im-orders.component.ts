import { Component, OnInit } from '@angular/core';
import { InventoryService, NewPOOrder } from '../../../services/inventory.service';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// ✅ Interfaces outside of class
interface Product {
  productsId: number;
  productsName: string;
  productsDescription: string;
  categoryName: string;
  productsUnitPrice: number;
  productsQuantity: number;
  productsImage: string;
  suppliersName: string;
}

interface OrderItem {
  orderId: number;
  userId: number;
  productId: number;
  productName: string;
  quantity: number;
  stock: number;
  orderStatus: string;
}

interface ProcessedOrder {
  orderId: number;
  userId: number;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    currentStock: number;
    orderStatus: string;
  }[];
}

@Component({
  selector: 'app-view-im-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './view-im-orders.component.html',
  styleUrls: ['./view-im-orders.component.css']
})
export class ViewImOrdersComponent implements OnInit {
  orders: ProcessedOrder[] = [];
  filteredOrders: ProcessedOrder[] = [];
  productMap: Map<number, Product> = new Map();
  isLoading: boolean = true;
  error: string = '';

  filters = {
    orderId: '',
    userId: '',
    productName: ''
  };

  // ✅ State for modal
  showScheduleModal = false;
  selectedOrderId: number | null = null;
  selectedProduct: any = null;
  scheduleData = {
    quantity: 0,
    startDate: '',
    endDate: '',
    remarks: ''
  };

  // ✅ Track scheduled products
  isProductScheduled: Map<number, boolean> = new Map();

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    this.error = '';

    try {
      await this.loadProducts();
      await this.loadOrders();
    } catch (error) {
      this.error = 'Failed to load data: ' + (error as Error).message;
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private loadProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getAllProducts().subscribe({
        next: (products: Product[]) => {
          this.productMap.clear();
          products.forEach(product => this.productMap.set(product.productsId, product));
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  private loadOrders(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.inventoryService.getAllNewOrders().subscribe({
        next: (apiOrders: NewPOOrder[]) => {
          const orderItems: OrderItem[] = apiOrders.map(o => ({
            orderId: o.orderId,
            userId: o.userId,
            productId: o.productId,
            productName: o.productName,
            quantity: o.quantity,
            stock: o.currentStock,
            orderStatus: o.orderStatus || 'Pending'
          }));
console.log('API Orders:', apiOrders);

          const groupedOrders = new Map<number, ProcessedOrder>();
          orderItems.forEach(item => {
            if (!groupedOrders.has(item.orderId)) {
              groupedOrders.set(item.orderId, {
                orderId: item.orderId,
                userId: item.userId,
                items: []
              });
            }

            const order = groupedOrders.get(item.orderId)!;
            order.items.push({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              currentStock: item.stock,
              orderStatus: item.orderStatus
            });

            // ✅ Check if product already has active schedule
            this.checkActiveSchedules(item.productId);
          });

          this.orders = Array.from(groupedOrders.values()).sort((a, b) => b.orderId - a.orderId);
          this.filteredOrders = [...this.orders];
          resolve();
        },
        error: (err) => reject(err)
      });
    });

    
  }

  // private checkActiveSchedules(productId: number): void {
  //   this.productService.hasActiveSchedule(productId).subscribe({
  //     next: (hasSchedule: boolean) => {
  //       this.isProductScheduled.set(productId, hasSchedule);
  //     },
  //     error: (err) => {
  //       console.error(`Failed to check active schedule for product ${productId}`, err);
  //       this.isProductScheduled.set(productId, false);
  //     }
  //   });
  // }
  private checkActiveSchedules(productId: number): void {
  this.productService.hasActiveSchedule(productId).subscribe({
    next: (hasSchedule: boolean) => {
      this.isProductScheduled.set(productId, hasSchedule);
    },
    error: (err) => {
      console.error(`Failed to check active schedule for product ${productId}`, err);
      this.isProductScheduled.set(productId, false);
    }
  });
}


  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const orderIdMatch = !this.filters.orderId || order.orderId.toString().includes(this.filters.orderId);
      const userIdMatch = !this.filters.userId || order.userId.toString().includes(this.filters.userId);
      const productNameMatch = !this.filters.productName || order.items.some(item =>
        item.productName.toLowerCase().includes(this.filters.productName.toLowerCase())
      );
      return orderIdMatch && userIdMatch && productNameMatch;
    });
  }

  clearFilters(): void {
    this.filters = { orderId: '', userId: '', productName: '' };
    this.filteredOrders = [...this.orders];
  }

  refreshData(): void {
    this.loadData();
  }

  getStockStatus(currentStock: number, orderQuantity: number): string {
    if (currentStock === 0) return 'out-of-stock';
    if (currentStock < orderQuantity) return 'insufficient-stock';
    if (currentStock <= 10) return 'low-stock';
    return 'sufficient-stock';
  }

  getTotalItems(): number {
    return this.filteredOrders.reduce((total, order) => total + order.items.length, 0);
  }

  getTotalOrders(): number {
    return this.filteredOrders.length;
  }

  trackByOrderId(index: number, order: ProcessedOrder): number {
    return order.orderId;
  }

  trackByItem(index: number, item: any): string {
    return `${item.productId}-${item.quantity}`;
  }

  scheduleProduction(orderId: number, product: any) {
    this.selectedOrderId = orderId;
    this.selectedProduct = product;
    this.scheduleData = { quantity: 0, startDate: '', endDate: '', remarks: '' };
    this.showScheduleModal = true;
  }

  closeModal() {
    this.showScheduleModal = false;
    this.selectedOrderId = null;
    this.selectedProduct = null;
  }

  confirmSchedule() {
    const payload = {
      orderId: this.selectedOrderId,
      productId: this.selectedProduct.productId,
      quantity: this.scheduleData.quantity,
      startDate: this.scheduleData.startDate,
      endDate: this.scheduleData.endDate,
      remarks: this.scheduleData.remarks,
      status: 'Scheduled'
    };
    
    console.log("Scheduling request:", payload);
    
    this.inventoryService.scheduleProduction(payload).subscribe({
      next: () => {
        alert('✅ Production Scheduled Successfully!');
        // Set the product as scheduled to disable the button
      this.isProductScheduled.set(this.selectedProduct.productId, true);
      
        this.closeModal();
        this.refreshData();
      },
      error: (err) => {
        console.error('Failed scheduling:', err);
        if (err.error?.message?.includes('open production order')) {
          alert('⚠️ This product already has an active schedule. Close it first.');
        } else {
          alert('❌ Failed to schedule production.');
        }
      }
    });
  }

  approveOrder(orderId: number) {
  if (!confirm(`Are you sure you want to approve order #${orderId}?`)) return;

  this.inventoryService.approvePurchaseOrder(orderId).subscribe({
    next: () => {
      alert(`✅ Order #${orderId} approved successfully!`);
      this.refreshData(); // refresh orders and stock
    },
    error: (err) => {
      console.error('Failed to approve order:', err);
      alert('❌ Failed to approve order.');
    }
  });
}




  
}
