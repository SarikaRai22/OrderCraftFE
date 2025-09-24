import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { InventoryService, Product, MonthlyStockDTO, Category } from '../../../services/inventory.service';
 
Chart.register(...registerables);
 
const chartColors = {
  blue: "#3b82f6",
  teal: "#14b8a6",
  purple: "#8b5cf6",
  indigo: "#6366f1",
  slate: "#475569",
  sky: "#0ea5e9",
  green: "#22c55e"
};
 
@Component({
  selector: 'app-tracking-stock-levels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracking-stock-level.component.html',
  styleUrls: ['./tracking-stock-level.component.css'],
})
export class TrackingStockLevelComponent implements OnInit {
  products: Product[] = [];
  categories: { categoriesId: number; categoryName: string }[] = [];
  selectedCategory: { categoriesId: number; categoryName: string } | null = null;
 
  selectedSupplier: number | null = null;
  lowStockThreshold: number = 0;
  searchName: string = '';
 
  // Filters
  selectedProductId: number | null = null;
 
  // Charts
  pieChart: any;
  thresholdChart: any;
 
  constructor(private inventoryService: InventoryService) {}
 
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }
 
  loadProducts() {
    this.inventoryService.getAllInventory().subscribe((res) => {
      this.products = res;
      this.updateCharts();
    });
  }
 
  loadCategories() {
    this.inventoryService.getAllCategories().subscribe((res) => {
      this.categories = res;
    });
  }
 
  applyFilters(): Product[] {
    return this.products.filter((p) => {
      const categoryMatches = !this.selectedCategory
        || (p.category && p.category.categoriesId === this.selectedCategory.categoriesId);
 
      const supplierMatches = !this.selectedSupplier
        || (p.supplier && p.supplier.suppliersId === this.selectedSupplier);
 
      const thresholdMatches = !this.lowStockThreshold
        || p.productsQuantity <= this.lowStockThreshold;
 
      const nameMatches = !this.searchName
        || p.productsName.toLowerCase().includes(this.searchName.toLowerCase());
 
      return categoryMatches && supplierMatches && thresholdMatches && nameMatches;
    });
  }
 
  updateCharts() {
    const filtered = this.applyFilters();
 
    // -------- Pie Chart (Quantity by category) --------
    const categoryMap: { [key: string]: number } = {};
    filtered.forEach((p) => {
      const name = p.category.categoryName;
      categoryMap[name] = (categoryMap[name] || 0) + p.productsQuantity;
    });
 
    if (this.pieChart) this.pieChart.destroy();
    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d');
    this.pieChart = new Chart(pieCtx!, {
      type: 'pie',
      data: {
        labels: Object.keys(categoryMap),
        datasets: [
          {
            label: 'Quantity by Category',
            data: Object.values(categoryMap),
            backgroundColor: [
              chartColors.blue,
              chartColors.teal,
              chartColors.purple,
              chartColors.indigo,
              chartColors.sky,
              chartColors.green
            ],
          },
        ],
      },
      options: { responsive: true },
    });
 
    // -------- Threshold Chart --------
    this.updateThresholdChart(filtered);
  }
 
  // Threshold chart
  updateThresholdChart(filtered: Product[]) {
    const labels = filtered.map((p) => p.productsName);
    const currentStock = filtered.map((p) => p.productsQuantity);
    const minThreshold = filtered.map((p) => p.minThreshold);
    const maxThreshold = filtered.map((p) => p.maxThreshold);
 
    if (this.thresholdChart) this.thresholdChart.destroy();
    const ctx = (document.getElementById('thresholdChart') as HTMLCanvasElement).getContext('2d');
    this.thresholdChart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Current Stock', data: currentStock, backgroundColor: 'blue' },
          { label: 'Min Threshold', data: minThreshold, backgroundColor: 'red' },
          { label: 'Max Threshold', data: maxThreshold, backgroundColor: 'green' },
        ],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    });
  }
 
  onCategorySelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory = value === 'all'
      ? null
      : this.categories.find(c => c.categoriesId === +value) || null;
 
    this.updateCharts();
  }
 
}
 
 