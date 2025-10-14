// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-pm-dashboard',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './pm-dashboard.component.html',
//   styleUrl: './pm-dashboard.component.css'
// })
// export class PmDashboardComponent {

// }

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pm-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './pm-dashboard.component.html',
  styleUrls: ['./pm-dashboard.component.css']  // ✅ fixed plural
})
export class PmDashboardComponent {}

