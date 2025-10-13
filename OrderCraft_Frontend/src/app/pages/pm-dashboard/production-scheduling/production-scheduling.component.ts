import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductionScheduleService } from '../../../services/production-schedule.service';

@Component({
  selector: 'app-product-scheduling',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'./production-scheduling.component.html',
  styleUrls: ['./production-scheduling.component.css']
})
export class ProductionSchedulingComponent implements OnInit {

  scheduleForm!: FormGroup;
  products: any[] = [];
  schedules: any[] = [];
  message = '';

  constructor(
    private fb: FormBuilder,
    private scheduleService: ProductionScheduleService
  ) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.loadProducts();
    this.loadSchedules();
  }

  loadProducts() {
    this.scheduleService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  loadSchedules() {
    this.scheduleService.getSchedules().subscribe({
      next: (data) => this.schedules = data,
      error: (err) => console.error('Error loading schedules:', err)
    });
  }

  onSubmit() {
    if (this.scheduleForm.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    this.scheduleService.createSchedule(this.scheduleForm.value).subscribe({
      next: (res) => {
        this.message = 'Production schedule created successfully!';
        this.scheduleForm.reset();
        this.loadSchedules();
      },
      error: (err) => {
        this.message = 'Error: ' + (err.error?.message || 'Failed to create schedule');
      }
    });
  }
}
