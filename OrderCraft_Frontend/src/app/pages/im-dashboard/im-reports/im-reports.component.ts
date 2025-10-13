import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-im-reports',
  templateUrl: './im-reports.component.html',
  standalone: true,
  styleUrls: ['./im-reports.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ImReportsComponent {
  reportForm: FormGroup;
  previewData: any[] = [];
  loading = false;
  errorMsg = '';

  //filters

  constructor(private fb: FormBuilder, private inventoryService: InventoryService) {
    this.reportForm = this.fb.group({
      reportType: ['', Validators.required],
      categoryId: [''],
      startDate: [''],
      endDate: [''],
      status: [''],
      transactionType: [''],
      format: ['pdf', Validators.required] // default
    });

    // Dynamically update validators based on reportType
    this.reportForm.get('reportType')?.valueChanges.subscribe((type) => {
      this.updateValidators(type);
    });
  }



  private updateValidators(type: string) {
    // Reset validators
    this.reportForm.get('categoryId')?.clearValidators();
    this.reportForm.get('startDate')?.clearValidators();
    this.reportForm.get('endDate')?.clearValidators();

    if (type === 'stock') {
      // only category filter (optional)
    } else if (type === 'transaction') {
      // category, startDate, endDate all optional
    } else if (type === 'production') {
      // only date filters (optional)
    }

    this.reportForm.get('categoryId')?.updateValueAndValidity();
    this.reportForm.get('startDate')?.updateValueAndValidity();
    this.reportForm.get('endDate')?.updateValueAndValidity();
  }



  categories: any[] = [];
  productionStatuses: string[] = [];
  previewClicked = false;
  transactionTypes: string[] = [];






columnMapping: { key: string; label: string }[] = [];




ngOnInit() {
  // Load categories into dropdown
  this.inventoryService.getCategories().subscribe({
    next: (data) => this.categories = data,
    error: () => this.errorMsg = 'Failed to load categories'
  });

  // statuses
  this.inventoryService.getProductionStatuses().subscribe({
    next: (data) => this.productionStatuses = data,
    error: () => this.errorMsg = 'Failed to load production statuses'
  });

  this.inventoryService.getTransactionTypes().subscribe({
    next: (data) => this.transactionTypes = data,
    error: () => this.errorMsg = 'Failed to load transaction types'
  });
}




//reports preview added

onPreview() {
  this.previewClicked = true;
  this.errorMsg = '';
  this.previewData = [];

  if (!this.reportForm.value.reportType) {
    this.errorMsg = 'Please select a report type!';
    return;
  }

  const { reportType, categoryId, startDate, endDate, status,transactionType, } = this.reportForm.value;
  this.loading = true;

  const request: any = { categoryId, startDate, endDate, status, transactionType };

  if (reportType === 'stock') {
    this.inventoryService.previewStockReport(request).subscribe({
      next: (data) => {
        this.setStockPreviewData(data);   // ✅ stock mapping
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error fetching stock report';
        this.loading = false;
      }
    });
  } else if (reportType === 'transaction') {
    this.inventoryService.previewTransactionReport(request).subscribe({
      next: (data) => {
        this.setTransactionPreviewData(data);  // ✅ transaction mapping
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error fetching transaction report';
        this.loading = false;
      }
    });
  } else if (reportType === 'production') {
    this.inventoryService.previewProductionReport(request).subscribe({
      next: (data) => {
        this.setProductionPreviewData(data);  // ✅ production mapping
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error fetching production report';
        this.loading = false;
      }
    });
  }
}



  // === Export PDF / CSV ===
  onExport() {
    this.errorMsg = '';

    if (!this.reportForm.value.reportType) {
      this.errorMsg = 'Please select a report type!';
      return;
    }

    // const { reportType, categoryId, startDate, endDate, format } = this.reportForm.value;
    // const request = { categoryId, startDate, endDate };

    const { reportType, categoryId, startDate, endDate, status, transactionType, format } = this.reportForm.value;
    const request: any = { categoryId, startDate, endDate, status, transactionType };


    let exportFn;
    if (reportType === 'stock') {
      exportFn = this.inventoryService.exportStockReport(request, format);
    } else if (reportType === 'transaction') {
      exportFn = this.inventoryService.exportTransactionReport(request, format);
    } else {
      exportFn = this.inventoryService.exportProductionReport(request, format);
    }

    exportFn.subscribe({
      next: (blob) => {
        const fileType = format === 'csv' ? 'text/csv' : 'application/pdf';
        saveAs(new Blob([blob], { type: fileType }), `${reportType}-report.${format}`);
      },
      error: () => { this.errorMsg = 'Error exporting report'; }
    });
  }



  pageSize = 10;   // show 5 rows per page
currentPage = 1;
paginatedData: any[] = [];



setStockPreviewData(data: any[]) {
  this.previewData = data.map(item => ({
    productId: item.productId,
    productName: item.productName,
    productDescription: item.productDescription,
    categoryName: item.categoryName,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    minThreshold: item.minThreshold,
    maxThreshold: item.maxThreshold
  }));

  this.columnMapping = [
    { key: 'productId', label: 'Product Id' },
    { key: 'productName', label: 'Name' },
    { key: 'productDescription', label: 'Description' },
    { key: 'categoryName', label: 'Category' },
    { key: 'unitPrice', label: 'Price' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'minThreshold', label: 'Minimum Threshold' },
    { key: 'maxThreshold', label: 'Maximum Threshold' }
  ];

  this.currentPage = 1;
  this.updatePagination();
}


setTransactionPreviewData(data: any[]) {
  this.previewData = data.map(item => ({
    transactionId: item.transactionId,
    productName: item.productName,
    transactionType: item.transactionType,
    quantity: item.quantity,
    transactionDate: this.formatDate(item.transactionDate), // format here
    status: item.status
  }));

  this.columnMapping = [
    { key: 'productName', label: 'Product' },
    { key: 'transactionType', label: 'Type' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'transactionDate', label: 'Date' },
    //{ key: 'status', label: 'Status' }
  ];

  this.currentPage = 1;
  this.updatePagination();
}


formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0]; 
  // → keeps only YYYY-MM-DD
}


setProductionPreviewData(data: any[]) {
  this.previewData = data.map(item => ({
    productionId: item.productionId,
    productName: item.productName,
    categoryName: item.categoryName,
    quantityPlanned: item.quantityPlanned,
    startDate: item.startDate,
    endDate: item.endDate,
    status: item.status
  }));

  this.columnMapping = [
    { key: 'productName', label: 'Product' },
    { key: 'categoryName', label: 'Category' },
    { key: 'quantityPlanned', label: 'Planned Qty' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status' }
  ];

  this.currentPage = 1;
  this.updatePagination();
}





updatePagination() {
  if (!this.previewData || this.previewData.length === 0) {
    this.paginatedData = [];
    return;
  }

  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;

  // create a new array reference so Angular detects change
  this.paginatedData = [...this.previewData.slice(start, end)];
}

get totalPages(): number {
  return this.previewData.length > 0
    ? Math.ceil(this.previewData.length / this.pageSize)
    : 1;
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
