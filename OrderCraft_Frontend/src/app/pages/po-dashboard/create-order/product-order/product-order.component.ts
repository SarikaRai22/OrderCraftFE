
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { OrderService } from '../../../../services/order.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProductOrderComponent implements OnInit {
  products: any[] = [];

  customer = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: ''
  };

  // items: {
  //   productId: number | null;
  //   quantity: number | null;
  //   unitPrice?: number;
  //   totalPrice?: number;
  // }[] = [
  //   { productId: null, quantity: null }
  // ];



 items: {
  productId: number | null;
  quantity: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  productSearch?: string;
  productSuggestions?: any[];
  productSearchTouched?: boolean;
}[] = [
  { productId: null, quantity: null, unitPrice: null, totalPrice: null, productSearch: '', productSuggestions: [], productSearchTouched: false }
];



  constructor(private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router // ✅ inject
) {}


orderPlaced: boolean = false;
placedOrderDetails: any = null;
showConfirmation: boolean = false;



  // ngOnInit(): void {
  //   this.productService.getAllProducts().subscribe({
  //     next: (data) => this.products = data,
  //     error: (err) => console.error('Failed to load products', err)
  //   });
  // }



  ngOnInit(): void {
  this.productService.getAllProducts().subscribe({
    next: (data) => this.products = data,
    error: (err) => console.error('Failed to load products', err)
  });

  // Add productSearch fields for each item
  this.items.forEach(item => {
    item.productSearch = '';
    item.productSuggestions = [];
    item.productSearchTouched = false;
  });
}

  // addItem(): void {
  //   this.items.push({ productId: null, quantity: null });
  // }



  addItem(): void {
  this.items.push({
    productId: null,
    quantity: null,
    unitPrice: null,
    totalPrice: null,
    productSearch: '',
    productSuggestions: [],
    productSearchTouched: false
  });
}



// Called when typing in the product input
onProductSearchChange(index: number): void {
  const searchText = this.items[index].productSearch?.toLowerCase() || '';
  if (searchText.length > 0) {
    this.items[index].productSuggestions = this.products
      .filter(p => p.productsName.toLowerCase().includes(searchText))
      .filter(p => !this.isProductAlreadySelected(p.productsId, index)); // prevent duplicates
  } else {
    this.items[index].productSuggestions = [];
  }
}

// Optional: show suggestions on focus
onProductSearchFocus(index: number) {
  if (!this.items[index].productSuggestions) this.items[index].productSuggestions = [];
}

// Called when user clicks a suggestion
// selectProduct(index: number, product: any): void {
//   this.items[index].productId = product.productsId;
//   this.items[index].unitPrice = product.unitPrice || product.productsUnitPrice; // adjust based on your backend field
//   this.items[index].totalPrice = this.items[index].quantity ? this.items[index].quantity * this.items[index].unitPrice : 0;

//   this.items[index].productSearch = product.productsName;
//   this.items[index].productSuggestions = [];
//   this.items[index].productSearchTouched = true;
// }


selectProduct(index: number, product: any): void {
  const item = this.items[index];
  if (!item || !product) return; // safety check

  item.productId = product.productsId;

  // Assign unitPrice, fallback to 0 if null/undefined
  item.unitPrice = product.unitPrice ?? product.productsUnitPrice ?? 0;

  // Calculate totalPrice safely
  const quantity = item.quantity ?? 0;
  item.totalPrice = quantity * item.unitPrice!;

  item.productSearch = product.productsName;
  item.productSuggestions = [];
  item.productSearchTouched = true;
}




  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

onProductChange(index: number): void {

  const selectedProduct = this.products.find(
    p => Number(p.productsId) === Number(this.items[index].productId)
  );


  if (selectedProduct) {
    this.items[index].unitPrice = selectedProduct.unitPrice;
    this.updateItemTotal(index);
  } else {
    this.items[index].unitPrice = undefined;
    this.items[index].totalPrice = undefined;
  }
}




 onQuantityChange(index: number): void {
  this.updateItemTotal(index);
}


  updateItemTotal(index: number): void {
    const item = this.items[index];
    if (item.unitPrice != null && item.quantity != null) {
      item.totalPrice = item.unitPrice * item.quantity;
    } else {
      item.totalPrice = 0;
    }
  }

getSubtotal(): number {
  return this.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
}

getTax(): number {
  const tax = this.getSubtotal() * 0.18;
  return Math.round(tax * 100) / 100; // Round to 2 decimal places
}

getTotal(): number {
  return Math.round((this.getSubtotal() + this.getTax()) * 100) / 100;
}




submitOrder(): void {
  const orderPayload = {
    supplierId: 1,
    items: this.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    })),
    customer: this.customer
  };

  this.orderService.createProductOrder(orderPayload).subscribe({
    next: (response) => {
      if (!response?.poId) {
        alert('Order placed but failed to get order ID.');
        return;
      }

      this.orderPlaced = true;
      this.placedOrderDetails = {
        ...orderPayload,
        orderTotal: this.getTotal(),
        tax: this.getTax(),
        subtotal: this.getSubtotal(),
        orderId: response.poId, // ✅ use real ID from backend
      };

      // Optional: open invoice automatically
      this.viewInvoice();
    },
    error: (err) => {
      console.error(err);
      alert('Failed to place product order');
    }
  });
}



isProductAlreadySelected(productId: number, currentIndex: number): boolean {
  return this.items.some((item, index) =>
    index !== currentIndex && item.productId === productId
  );
}



getProductName(productId: number): string {
  const product = this.products.find(p => p.productsId === productId);
  return product ? product.productsName : 'Unknown';
}



resetForm() {
  this.orderPlaced = false;
  this.placedOrderDetails = null;

  this.customer = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: ''
  };

  this.items = [
    { productId: null, quantity: null }
  ];
}


confirmSubmitOrder(): void {
  this.showConfirmation = false;
  this.submitOrder(); // Call the original method
}

cancelSubmit(): void {
  this.showConfirmation = false;
}



// New properties
// Search and select existing customer
selectedCustomerEmail: string = '';
customerSuggestions: any[] = [];


// Call when typing in the email search box
// Called whenever the input changes
onCustomerEmailChange(): void {
  if (this.selectedCustomerEmail.length > 1) {
    this.orderService.getCustomersByEmail(this.selectedCustomerEmail)
      .subscribe({
        next: (data) => this.customerSuggestions = data,
        error: (err) => console.error('Failed to fetch customers', err)
      });
  } else {
    this.customerSuggestions = [];
  }
}


// Called when user clicks on a suggestion
selectCustomer(cust: any): void {
  this.customer.customerName = cust.customerName;
  this.customer.customerEmail = cust.customerEmail;
  this.customer.customerPhone = cust.customerPhone;
  this.customer.customerAddress = cust.customerAddress;

  // Fill input box and clear suggestions
  this.selectedCustomerEmail = cust.customerEmail;
  this.customerSuggestions = [];
}


// trackOrder(orderId: number) {
//   this.router.navigate(['/po-dashboard/order-tracking', orderId]);
// }



viewInvoice() {
  if (!this.placedOrderDetails?.orderId) {
    alert('Order ID not found.');
    return;
  }

  this.orderService.getInvoicePdf(this.placedOrderDetails.orderId).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      // Open PDF in new tab
      window.open(url, '_blank');

      // Or to force download instead:
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `invoice_${this.placedOrderDetails.orderId}.pdf`;
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

