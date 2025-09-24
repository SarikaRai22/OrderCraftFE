import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionTimeoutService } from './services/session-timeout.service';
import { SessionWarningDialogComponent } from './pages/session-warning-dialog/session-warning-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SessionWarningDialogComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showWarning = false;
  countdown = 30;

  constructor(private sessionService: SessionTimeoutService) {}

  ngOnInit() {
    // subscribe to service observables
    this.sessionService.showWarning$.subscribe(show => this.showWarning = show);
    this.sessionService.warning$.subscribe(sec => this.countdown = sec);
  }

  onStayLoggedIn() {
    this.sessionService.keepAlive();
  }

  onLogout() {
    this.sessionService.logout(); // ✅ use a proper exposed logout method
  }
}
