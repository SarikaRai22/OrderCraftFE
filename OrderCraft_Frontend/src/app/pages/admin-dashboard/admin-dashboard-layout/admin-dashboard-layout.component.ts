import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard-layout.component.html',
  styleUrls: ['./admin-dashboard-layout.component.scss']
})
export class AdminDashboardLayoutComponent {
  // sidebarOpen = true;

  // toggleSidebar() {
  //   this.sidebarOpen = !this.sidebarOpen;
  // }

  // logout() {
  //   localStorage.removeItem('token');
  //   window.location.href = '/login';
  // }


  profileMode: 'view' | 'edit' | null = null;

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => this.dropdownOpen = false, 150);
  }

  openProfile(mode: 'view' | 'edit') {
    this.router.navigate(['/admin-dashboard/user-profile', mode]);
  }

  constructor(private router: Router) {}

  // logout() {
  //   localStorage.removeItem('token');
  //   window.location.href = '/login';
  // }

  logout() {
    console.log('Logging out...');
    localStorage.removeItem('token');
    console.log('After removal:', localStorage.getItem('token')); // should be null
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
