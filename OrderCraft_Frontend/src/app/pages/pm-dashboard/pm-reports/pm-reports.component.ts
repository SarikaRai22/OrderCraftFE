import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-production-reports',
  templateUrl: './pm-reports.component.html',
  styleUrls: ['./pm-reports.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ProductionReportsComponent {
  reportForm: FormGroup;
  previewData: any[] = [];
  paginatedData: any[] = [];
  columnMapping: { key: string; label: string }[] = [];

  categories: any[] = [];
  productionStatuses: string[] = [];

  loading = false;
  errorMsg = '';
  previewClicked = false;

  pageSize = 10;
  currentPage = 1;

  //filters added

  constructor(private fb: FormBuilder, private inventoryService: InventoryService) {
    this.reportForm = this.fb.group({
      categoryId: [''],
      startDate: [''],
      endDate: [''],
      status: [''],
      format: ['pdf'] // default export format
    });
  }

  ngOnInit() {
    this.inventoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => (this.errorMsg = 'Failed to load categories'),
    });

    this.inventoryService.getProductionStatuses().subscribe({
      next: (data) => (this.productionStatuses = data),
      error: () => (this.errorMsg = 'Failed to load production statuses'),
    });
  }

  // === Preview Function ===
  onPreview() {
    this.previewClicked = true;
    this.errorMsg = '';
    this.previewData = [];

    const { categoryId, startDate, endDate, status } = this.reportForm.value;
    this.loading = true;

    const request: any = { categoryId, startDate, endDate, status };

    this.inventoryService.previewProductionReport(request).subscribe({
      next: (data) => {
        this.setProductionPreviewData(data);
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error fetching production report';
        this.loading = false;
      },
    });
  }

  // === Export Function ===
  onExport() {
    this.errorMsg = '';
    const { categoryId, startDate, endDate, status, format } = this.reportForm.value;
    const request: any = { categoryId, startDate, endDate, status };

    this.inventoryService.exportProductionReport(request, format).subscribe({
      next: (blob) => {
        const fileType = format === 'csv' ? 'text/csv' : 'application/pdf';
        saveAs(new Blob([blob], { type: fileType }), `production-report.${format}`);
      },
      error: () => {
        this.errorMsg = 'Error exporting production report';
      },
    });
  }

  // === Preview Mapping ===
  setProductionPreviewData(data: any[]) {
    this.previewData = data.map((item) => ({
      productionId: item.productionId,
      productName: item.productName,
      categoryName: item.categoryName,
      quantityPlanned: item.quantityPlanned,
      startDate: this.formatDate(item.startDate),
      endDate: this.formatDate(item.endDate),
      status: item.status,
    }));

    this.columnMapping = [
      { key: 'productName', label: 'Product' },
      { key: 'categoryName', label: 'Category' },
      { key: 'quantityPlanned', label: 'Planned Qty' },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date' },
      { key: 'status', label: 'Status' },
    ];

    this.currentPage = 1;
    this.updatePagination();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // === Pagination ===
  updatePagination() {
    if (!this.previewData || this.previewData.length === 0) {
      this.paginatedData = [];
      return;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = [...this.previewData.slice(start, end)];
  }

  get totalPages(): number {
    return this.previewData.length > 0 ? Math.ceil(this.previewData.length / this.pageSize) : 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
