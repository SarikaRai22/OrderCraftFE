import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-po-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './po-dashboard.component.html',
  styleUrls: ['./po-dashboard.component.scss']
})
export class PoDashboardComponent {}
