import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Corrected the import path to go up one more level to find the 'services' directory
import { ProductionTrackingService, ProductionSchedule, ProductionTrackingDetails } from '../../../services/production-tracking.service'; // Adjust path if needed

@Component({
  selector: 'app-production-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-tracking.component.html',
  styleUrls: ['./production-tracking.component.scss'] // Use .scss for consistency
})
export class ProductionTrackingComponent implements OnInit {
  // Use strong types for better code quality and editor support
  schedules: ProductionSchedule[] = [];
  selectedScheduleId: number | null = null;
  trackingDetails: ProductionTrackingDetails | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  // Values used by the timeline in the template
  readonly stages = ['SCHEDULED', 'IN_PRODUCTION', 'COMPLETED', 'DISPATCHED'];
  readonly stageLabels = ['Scheduled', 'In Production', 'Completed', 'Dispatched'];
  readonly stageIcons = [
    'bi bi-calendar-plus',  // SCHEDULED
    'bi bi-box-seam',       // IN_PRODUCTION
    'bi bi-check2-circle',  // COMPLETED
    'bi bi-truck'           // DISPATCHED
  ];

  constructor(
    private route: ActivatedRoute,
    private trackingService: ProductionTrackingService
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.trackingService.getAllSchedules().subscribe({
      // Added explicit type for 'data' to resolve TS7006
      next: (data: ProductionSchedule[]) => {
        this.schedules = data;
        this.isLoading = false;
        // Check for route param after schedules have loaded
        this.checkRouteForId();
      },
      // Added explicit type for 'err' to resolve TS7006
      error: (err: any) => {
        console.error('Failed to load schedules:', err);
        // Provide a more detailed and helpful error message
        if (err.status === 0 || err.status === 404) {
          this.errorMessage = 'Could not connect to the backend API. Is the server running and the URL correct?';
        } else {
          this.errorMessage = `Error loading schedules. Backend returned code ${err.status}: ${err.message}`;
        }
        this.isLoading = false;
      }
    });
  }

  private checkRouteForId(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (idFromRoute) {
      const scheduleId = +idFromRoute;
      // Ensure the ID from the route is actually in our list of schedules
      if (this.schedules.some(s => s.psId === scheduleId)) {
        this.selectedScheduleId = scheduleId;
        this.fetchTrackingDetails();
      }
    }
  }

  fetchTrackingDetails(): void {
    if (!this.selectedScheduleId) {
      this.trackingDetails = null;
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.trackingService.getTrackingDetails(this.selectedScheduleId).subscribe({
      // Added explicit type for 'data' to resolve TS7006
      next: (data: ProductionTrackingDetails) => {
        this.trackingDetails = data;
        this.isLoading = false;
      },
      // Added explicit type for 'err' to resolve TS7006
      error: (err: any) => {
        console.error('Failed to load tracking details:', err);
        // Provide a more detailed and helpful error message
        if (err.status === 0 || err.status === 404) {
          this.errorMessage = `Could not load details for schedule #${this.selectedScheduleId}. Is the server running?`;
        } else {
          this.errorMessage = `Error loading details. Backend returned code ${err.status}: ${err.message}`;
        }
        this.isLoading = false;
        this.trackingDetails = null;
      }
    });
  }

  isStageActive(stage: string): boolean {
    if (!this.trackingDetails?.currentStage) {
      return false;
    }
    const currentIndex = this.stages.indexOf(this.trackingDetails.currentStage);
    const stageIndex = this.stages.indexOf(stage);
    return stageIndex <= currentIndex;
  }

  refreshSchedules(): void {
    this.selectedScheduleId = null;
    this.trackingDetails = null;
    this.loadSchedules();
  }
}

