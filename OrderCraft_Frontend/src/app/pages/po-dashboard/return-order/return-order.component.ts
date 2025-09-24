import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-return-order',
  templateUrl: './return-order.component.html',
  styleUrls: ['./return-order.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class ReturnOrderComponent implements OnInit {
  order: any;
  returnReason: string = '';
  returnedByUserId!: number;
  itemsToReturn: any[] = [];

  constructor(private router: Router, private orderService: OrderService) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras.state?.['order'];
  }

  ngOnInit(): void {
    if (!this.order) {
      alert('No order selected.');
      this.router.navigate(['/po-dashboard/view-orders']);
      return;
    }

    this.returnedByUserId = this.order.user?.userId || this.order.userId;

    this.itemsToReturn = this.order.purchaseOrderItems.map((item: any) => ({
      productId: item.product?.productsId,
      quantity: 1,
      conditionNote: ''
    }));
  }

  submitReturn(): void {
    const dto = {
      purchaseOrderId: this.order.poId,
      returnReason: this.returnReason,
      status: 'RETURNED',
      items: this.itemsToReturn.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        conditionNote: item.conditionNote
      }))
    };

    this.orderService.returnOrder(dto).subscribe({
      next: () => {
        alert('Return order submitted successfully.');
        this.router.navigate(['/po-dashboard/view-orders']);
      },
      error: (err) => {
        alert('Failed to return order: ' + (err.error?.message || 'Server error'));
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/po-dashboard/view-orders']);
  }
}

