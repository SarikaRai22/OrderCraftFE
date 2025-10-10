import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductionTimelineService, ProductionUnit } from '../../../services/production.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-production-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './production-task.component.html',
  styleUrls: ['./production-task.component.css']
})
export class ProductionTaskComponent {
  categoryId!: number;
  productId!: number;
  quantity!: number;
  unitIdToComplete!: number;

  startDate!: string; // yyyy-MM-dd
  endDate!: string;   // yyyy-MM-dd

  assignedUnit?: ProductionUnit;
  message: string = '';

  categoryName: string = '';
  productName: string = '';

  constructor(
    private taskService: ProductionTimelineService,
    private router: Router
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.categoryId = state['categoryId'] || 0;
      this.productId = state['productId'] || 0;
      this.quantity = state['quantity'] || 0;

      this.categoryName = state['categoryName'] || '';
      this.productName = state['productName'] || '';
    }
  }

  assignTask() {
    if (!this.categoryId || !this.productId || !this.quantity || !this.startDate || !this.endDate) {
      this.message = 'Please fill all fields including start and end dates.';
      return;
    }

    this.taskService.assignTask(this.categoryId, this.productId, this.quantity, this.startDate, this.endDate)
      .subscribe({
        next: (unit) => {
          this.assignedUnit = unit;
          this.message = `✅ Task assigned to unit: ${unit.unitName}`;
        },
        error: () => {
          this.message = '❌ No available production unit found for this task.';
        }
      });
  }

  completeTask() {
    if (!this.unitIdToComplete) {
      this.message = 'Please enter Unit ID to complete.';
      return;
    }

    this.taskService.completeTask(this.unitIdToComplete).subscribe({
      next: () => {
        this.message = `✅ Task completed for Unit ID: ${this.unitIdToComplete}`;
        this.unitIdToComplete = 0;
        this.assignedUnit = undefined;
      },
      error: () => {
        this.message = '❌ Error completing task.';
      }
    });
  }
}
