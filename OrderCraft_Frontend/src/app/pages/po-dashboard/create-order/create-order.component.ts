import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
    standalone: true, // ✅ Add this
  styleUrls: ['./create-order.component.css'],
  imports: [CommonModule, RouterModule], // ✅ Add RouterModule here

})
export class CreateOrderComponent {
  constructor(private router: Router) {}

  goToProductOrder() {
    this.router.navigate(['po-dashboard/create-order/product-order']);
  }

  goToRawMaterialOrder() {
    this.router.navigate(['po-dashboard/create-order/raw-material-order']);
  }
}
