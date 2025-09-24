import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-po-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './po-dashboard-layout.component.html',
  styleUrls: ['./po-dashboard-layout.component.scss']
})
export class PoDashboardLayoutComponent {

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
    this.router.navigate([`/po-dashboard/${path}`]);
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

  goToDashboard(): void {
    this.router.navigate(['/po-dashboard']);
  }
}
