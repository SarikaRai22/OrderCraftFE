import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';  // ✅ Import this
import { OrderService } from '../../../services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-tracking',
  imports: [FormsModule, CommonModule],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {
  orders: number[] = [];
  selectedOrderId: number | null = null;
  trackingInfo: any;
  stages = ['Order Placed', 'Processing', 'Shipped', 'In Transit', 'Delivered'];

  stageIcons: string[] = [
  'bi bi-clipboard-check',  // Order Placed
  'bi bi-brush',            // Processing
  'bi bi-box-seam',         // Shipped
  'bi bi-truck',            // In Transit
  'bi bi-house-door'        // Delivered
];

  constructor(private orderService: OrderService,
        private route: ActivatedRoute

  ) {}

ngOnInit(): void {
  this.fetchOrderIds();

  this.route.paramMap.subscribe(params => {
    const idFromRoute = params.get('id');
    if (idFromRoute) {
      this.selectedOrderId = Number(idFromRoute);
      this.fetchTrackingStatus();
    } else {
      this.selectedOrderId = null; // No ID case
    }
  });
}



  fetchOrderIds() {
    this.orderService.getAllOrderIds().subscribe({
      next: (res) => {
        this.orders = res;
      },
      error: (err) => {
        console.error('Failed to load order IDs', err);
      }
    });
  }

  fetchTrackingStatus() {
    if (!this.selectedOrderId) return;
    this.orderService.getTrackingStatus(this.selectedOrderId).subscribe({
      next: (res) => {
        this.trackingInfo = res;
      },
      error: (err) => {
        console.error('Error fetching tracking status:', err);
      }
    });
  }

  isStageActive(stage: string): boolean {
    if (!this.trackingInfo) return false;
    const currentIndex = this.stages.indexOf(this.trackingInfo.currentStatus);
    const thisIndex = this.stages.indexOf(stage);
    return thisIndex <= currentIndex;
  }

  refreshOrders(): void {
    this.fetchOrderIds();
    this.selectedOrderId = null;
    this.trackingInfo = null;
  }
}
