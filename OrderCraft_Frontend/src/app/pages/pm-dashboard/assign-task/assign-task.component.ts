import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { ProductionUnitService, ProductionUnit } from '../../../services/production-unit.service';

@Component({
  selector: 'app-assign-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css']
})
export class AssignTaskComponent implements OnInit, OnDestroy {
  units: ProductionUnit[] = [];
  filteredUnits: ProductionUnit[] = [];

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  searchTerm = '';
  selectedCategory: string = '';
  selectedProductId: number | null = null;
  quantity: number | null = null;

  private refreshSub?: Subscription;

  constructor(private unitService: ProductionUnitService) {}

  ngOnInit(): void {
    this.fetchUnits();
    this.refreshSub = interval(30000).subscribe(() => this.fetchUnits());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  fetchUnits(): void {
    this.loading = true;
    this.unitService.getUnits().subscribe({
      next: (data) => {
        this.units = data;
        this.filteredUnits = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load production units';
        this.loading = false;
      }
    });
  }

  filterUnits(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUnits = this.units.filter(unit =>
      unit.unitName.toLowerCase().includes(term) ||
      String(unit.categoryId).includes(term)
    );
  }

  assignTask(unit: ProductionUnit): void {
    if (!this.selectedProductId || !this.quantity) {
      this.errorMessage = 'Please enter both Product ID and Quantity.';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.unitService.assignTask(unit.categoryId, this.selectedProductId, this.quantity)
      .subscribe({
        next: () => {
          this.successMessage = `Task assigned successfully to ${unit.unitName}`;
          this.fetchUnits();
          this.selectedProductId = null;
          this.quantity = null;
        },
        error: () => {
          this.errorMessage = `Failed to assign task to ${unit.unitName}`;
        }
      });
  }
}
