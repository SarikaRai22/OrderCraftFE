import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionTrackingService, ProductionScheduleTrackingResponse } from '../../../services/production-tracking.service';

@Component({
  selector: 'app-production-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-tracking.component.html',
  styleUrls: ['./production-tracking.component.scss']
})
export class ProductionTrackingComponent implements OnInit {
  schedules: ProductionScheduleTrackingResponse[] = [];
  selectedScheduleId: number | null = null;
  trackingDetails: ProductionScheduleTrackingResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  readonly stages = ['CREATED', 'IN_PROGRESS', 'DISPATCHED', 'COMPLETED'];
  readonly stageLabels = ['Created', 'In Progress', 'Dispatched', 'Completed'];
  readonly stageIcons = ['bi bi-calendar-plus', 'bi bi-gear', 'bi bi-truck', 'bi bi-check2-circle'];

  constructor(private trackingService: ProductionTrackingService) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.trackingService.getAllSchedules().subscribe({
      next: (data) => {
        this.schedules = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load production schedules';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  fetchTrackingDetails(): void {
    if (!this.selectedScheduleId) return;
    this.isLoading = true;
    this.trackingService.getTrackingDetails(this.selectedScheduleId).subscribe({
      next: (data) => {
        this.trackingDetails = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load tracking details';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  isStageActive(stage: string): boolean {
    if (!this.trackingDetails?.status) return false;
    const currentIndex = this.stages.indexOf(this.trackingDetails.status);
    const stageIndex = this.stages.indexOf(stage);
    return stageIndex <= currentIndex;
  }

  updateAction(action: string): void {
    if (!this.trackingDetails) return;
    this.trackingService.updateAction(this.trackingDetails.scheduleId, action).subscribe({
      next: (response) => {
        alert(response);
        this.fetchTrackingDetails();
      },
      error: (err) => {
        console.error('Failed to update action:', err);
        alert('Error updating action');
      }
    });
  }

  refreshSchedules(): void {
    this.trackingDetails = null;
    this.selectedScheduleId = null;
    this.loadSchedules();
  }
}
