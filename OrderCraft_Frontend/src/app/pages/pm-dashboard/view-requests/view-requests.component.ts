import { Component, OnInit } from '@angular/core';
import { ProductionTimelineService, ViewProductionRequestDTO } from '../../../services/production.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.css'],
  standalone:true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
})
export class ViewRequestsComponent implements OnInit {
  productionRequests: ViewProductionRequestDTO[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(private productionService: ProductionTimelineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  // Fetch all production requests from database
  fetchRequests(): void {
    this.loading = true;
    this.errorMessage = null;

    this.productionService.viewProductionRequests().subscribe({
      next: (data) => {
        this.productionRequests = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load production requests.';
        console.error('Error fetching production requests:', err);
        this.loading = false;
      }
    });
  }

sendForScheduling(req: any): void {
  if (!req.product) return;

  this.router.navigate(['/pm-dashboard/production-task'], {
    state: {
      categoryId: req.product.category.categoriesId,
      categoryName: req.product.category.categoryName, // pass name
      productId: req.product.productsId,
      productName: req.product.productsName,           // pass name
      quantity: req.quantity
    }
  });
}




  
}


