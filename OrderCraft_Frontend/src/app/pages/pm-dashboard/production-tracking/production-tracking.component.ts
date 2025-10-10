import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-production-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-tracking.component.html',
  styleUrls: ['./production-tracking.component.css']
})
export class ProductionTrackingComponent implements OnInit {
  schedules: any[] = [];
  selectedScheduleId: number | null = null;
  progress: any = null;

  stages = ['Scheduled', 'In Production', 'Completed', 'Dispatched'];

  stageIcons: string[] = [
    'bi bi-calendar-plus', // Scheduled
    'bi bi-box-seam',      // In Production
    'bi bi-check2-circle', // Completed
    'bi bi-truck'          // Dispatched
  ];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadSchedules();

    this.route.paramMap.subscribe(params => {
      const idFromRoute = params.get('id');
      if (idFromRoute) {
        this.selectedScheduleId = Number(idFromRoute);
        this.loadProductionProgress(this.selectedScheduleId);
      } else {
        this.selectedScheduleId = null;
      }
    });
  }

  loadSchedules(): void {
    this.http.get<any[]>('http://localhost:8080/api/production-schedules').subscribe({
      next: data => this.schedules = data,
      error: err => console.error('Error loading schedules', err)
    });
  }

  loadProductionProgress(scheduleId: number): void {
    this.http.get<any>(`http://localhost:8080/api/production-progress/schedule/${scheduleId}`).subscribe({
      next: data => this.progress = data,
      error: err => console.error('Error loading progress', err)
    });
  }

  onScheduleSelect(): void {
    if (this.selectedScheduleId) {
      this.loadProductionProgress(this.selectedScheduleId);
    }
  }

  isStageActive(stage: string): boolean {
    if (!this.progress) return false;
    const currentIndex = this.stages.indexOf(this.progress.stage);
    const thisIndex = this.stages.indexOf(stage);
    return thisIndex <= currentIndex;
  }

  refreshSchedules(): void {
    this.loadSchedules();
    this.selectedScheduleId = null;
    this.progress = null;
  }
}
