import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductionTimelineService } from '../../../services/production.service';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs/operators';

interface Product {
  productsId: number;
  productsName: string;
}

@Component({
  selector: 'app-view-production-timeline',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-production-timeline.component.html',
  styleUrls: ['./view-production-timeline.component.css']
})
export class ViewProductionTimelineComponent implements OnInit {
  filterForm: FormGroup;
  timelines: any[] = [];
  allTimelines: any[] = [];
  products: Product[] = [];
  statuses: string[] = [];
  loading = false;
  error: string | null = null;

  // Pagination properties
  currentPage = 1;
  pageSize = 10; // show 10 rows per page
  paginatedTimelines: any[] = [];

  constructor(
    private fb: FormBuilder,
    private timelineService: ProductionTimelineService,
    private productService: ProductService
  ) {
    this.filterForm = this.fb.group({
      productId: [''],
      status: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllTimelines();
    this.loadProducts();

    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadAllTimelines(): void {
    this.loading = true;
    this.timelineService.getTimeline({}).subscribe({
      next: (data) => {
        this.allTimelines = data;
        this.timelines = data;
        this.statuses = [...new Set(data.map(t => t.status))];
        this.updatePaginatedTimelines();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to fetch production timeline';
        this.loading = false;
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: () => console.error('Failed to load products')
    });
  }

  applyFilters(): void {
    const { productId, status, startDate, endDate } = this.filterForm.value;

    const filter: any = {
      productId: productId ? Number(productId) : undefined,
      status: status || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    };

    if (!filter.productId && !filter.status && !filter.startDate && !filter.endDate) {
      this.timelines = this.allTimelines;
      this.updatePaginatedTimelines();
      return;
    }

    this.loading = true;
    this.timelineService.getTimeline(filter).subscribe({
      next: (data) => {
        this.timelines = data;
        this.updatePaginatedTimelines();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to fetch filtered production timeline';
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.timelines = this.allTimelines;
    this.updatePaginatedTimelines();
  }

  // Pagination methods
  updatePaginatedTimelines(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTimelines = this.timelines.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedTimelines();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.timelines.length / this.pageSize);
  }
}
