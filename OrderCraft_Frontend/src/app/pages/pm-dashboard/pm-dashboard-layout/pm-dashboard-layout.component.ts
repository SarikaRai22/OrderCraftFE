import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pm-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './pm-dashboard-layout.component.html',
  styleUrls: ['./pm-dashboard-layout.component.scss']
})
export class PmDashboardLayoutComponent {

  profileMode: 'view' | 'edit' | null = null;

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => this.dropdownOpen = false, 150);
  }


  openProfile(mode: 'view' | 'edit'): void {
    const path = mode === 'view' ? 'user-profile' : 'edit-profile';
    this.router.navigate([`/pm-dashboard/${path}`]);
    this.dropdownOpen = false;
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

  //added logout function

  goToDashboard(): void {
    this.router.navigate(['/pm-dashboard']);
  }
}
