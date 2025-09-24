import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [RouterOutlet, RouterModule],
})
export class AdminDashboardComponent {
  constructor(private router: Router, private route: RouterOutlet) {}

  navigate(path: string): void {
    this.router.navigate([`/admin-dashboard/${path}`]);
  }

  // logout(): void {
  //   localStorage.removeItem('token');
  //   this.router.navigate(['/login']);
  // }

  logout() {
    console.log('Logging out...');
    localStorage.removeItem('token');
    console.log('After removal:', localStorage.getItem('token')); // should be null
    this.router.navigate(['/login']);
  }

}
