import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // ✅ Add CommonModule here

})
export class ViewOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];


  filters = {
    orderId: '',
    startDate: '',
    endDate: '',
    orderType: '',
    status: ''
  };

  constructor(private orderService: OrderService, private router: Router) {}

  selectedOrderForEdit: any = null;
  minDate: string = '';
  selectedOrderIdToCancel: number | null = null;




  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (data: any[]) => {
        this.orders = data.sort((a, b) => b.poId - a.poId);
        this.filteredOrders = [...this.orders]; // ✅ show all orders immediately
        this.applyFilters(); // ✅ run filter logic once on load
      },
      error => {
        console.error('Error fetching orders:', error);
      }
    );
  }


applyFilters(): void {
  const { orderId, startDate, endDate, orderType, status } = this.filters;

  // ✅ If no filters applied, show everything
  if (!orderId && !startDate && !endDate && !orderType && !status) {
    this.filteredOrders = [...this.orders];
    return;
  }

  this.filteredOrders = this.orders.filter(order => {
    const matchesId =
      !orderId || order.poId.toString().includes(orderId);

    const matchesDate =
      (!startDate || new Date(order.poOrderDate) >= new Date(startDate)) &&
      (!endDate || new Date(order.poOrderDate) <= new Date(endDate));

    const hasProduct = order.purchaseOrderItems?.some((item: any) => item.product);
    const hasRaw = order.purchaseOrderItems?.some((item: any) => item.rawMaterial);

    const matchesType =
      !orderType ||
      (orderType === 'product' && hasProduct) ||
      (orderType === 'raw' && hasRaw);

    const matchesStatus =
      !status ||
      (order.poDeliveryStatus || '').toLowerCase() === status.toLowerCase();

    return matchesId && matchesDate && matchesType && matchesStatus;
  });
}

clearFilters(): void {
  this.filters = {
    orderId: '',
    startDate: '',
    endDate: '',
    orderType: '',
    status: ''
  };
  this.filteredOrders = [...this.orders]; // reset to all orders
}






  //To Return Order
  returnOrder(order: any): void {
  this.router.navigate(['/po-dashboard/return-order'], {
    state: { order: order }
  });
}


showCancelConfirmation(orderId: number): void {
  this.selectedOrderIdToCancel = orderId;
}

confirmCancel(): void {
  if (this.selectedOrderIdToCancel === null) return;

  this.orderService.cancelOrder(this.selectedOrderIdToCancel).subscribe({
    next: () => {
      const order = this.orders.find(o => o.poId === this.selectedOrderIdToCancel);
      if (order) {
        order.poDeliveryStatus = 'Cancelled';
      }
      this.selectedOrderIdToCancel = null; // hide confirmation box
    },
    error: (err) => {
      console.error('Cancel order failed:', err);
      const message = err?.error?.message || 'Unable to cancel order. Please try again.';
      alert('Failed to cancel order: ' + message);
      this.selectedOrderIdToCancel = null;
    }
  });
}

cancelCancel(): void {
  this.selectedOrderIdToCancel = null;
}



formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // returns yyyy-MM-dd
}


editOrder(order: any): void {
  // Create a deep clone to avoid mutating original order before submit
  this.selectedOrderForEdit = JSON.parse(JSON.stringify(order));

  console.log('Order to edit:', order);
  console.log('Order items:', order.purchaseOrderItems);
}

submitEditOrder(): void {
  if (!this.selectedOrderForEdit) return;

  const poId = this.selectedOrderForEdit.poId;
  const newDate = this.formatDate(this.selectedOrderForEdit.poExpectedDeliveryDate);


  const updatedItems = this.selectedOrderForEdit.purchaseOrderItems.map((item: any) => {
    const isProduct = !!item.product;
    return {
      poiId: item.poiId,
      quantity: item.quantity,
      ...(isProduct
        ? {} // Product item doesn't need extra fields
        : {
            rwId: item.rawMaterial?.rwId,
            supplierId: this.selectedOrderForEdit.poSupplier?.suppliersId
          })
    };
  });

  const isRawMaterialOrder = this.selectedOrderForEdit.purchaseOrderItems.some((item: any) => !!item.rawMaterial);

  const updateObservable = isRawMaterialOrder
    ? this.orderService.updateRawMaterialOrder(poId, newDate, updatedItems)
    : this.orderService.updateProductOrder(poId, newDate, updatedItems);


    console.log('Submitting edit for Order ID:', poId);
console.log('New expected delivery date:', newDate);
console.log('Updated items payload:', updatedItems);
console.log('Is raw material order:', isRawMaterialOrder);


  updateObservable.subscribe({
    next: () => {
      alert('Order updated successfully.');
      this.selectedOrderForEdit = null;
      this.fetchOrders();
    },
    error: (err) => {
      const msg = err.error?.message || 'Server error while updating order.';
      alert('Failed to update order: ' + msg);
    }
  });
}


  cancelEdit(): void {
    this.selectedOrderForEdit = null;
  }


  isCancelled(order: any): boolean {
  return (order.poDeliveryStatus || '').toLowerCase() === 'cancelled';
}



trackOrder(orderId: number) {
  this.router.navigate(['/po-dashboard/order-tracking', orderId]);
}


// In your component.ts
isButtonDisabled(order: any, button: string): boolean {
  const status = (order.poDeliveryStatus || '').toLowerCase();

  switch (button) {
    case 'track':
      return status === 'delivered' || status === 'cancelled' || status === 'returned';
    case 'edit':
    case 'cancel':
      return status === 'shipped' || status === 'in transit' || status === 'delivered' || status === 'cancelled' || status === 'returned';
    case 'return':
      // Disable if not delivered OR already returned
      return status !== 'delivered' || status === 'returned';
    case 'invoice':
      // Disable if cancelled or returned
      return status === 'cancelled' || status === 'returned';
    default:
      return false;
  }
}



hasProductItems(order: any): boolean {
  return order.purchaseOrderItems?.some((item: any) => item.product) ?? false;
}





viewInvoice(orderId: number): void {
  if (!orderId) {
    alert('Order ID not found.');
    return;
  }

  this.orderService.getInvoicePdf(orderId).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);

      // ✅ Open invoice in a new browser tab
      window.open(url, '_blank');

      // Or if you want to force download instead:
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `invoice_${orderId}.pdf`;
      // a.click();
      // window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Failed to fetch invoice', err);
      alert('Failed to fetch invoice PDF');
    }
  });
}






}
