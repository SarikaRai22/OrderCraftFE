import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-warning-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-warning-dialog.component.html',
  styleUrls: ['./session-warning-dialog.component.css']
})
export class SessionWarningDialogComponent {
  @Input() visible = false;   // modal visibility
  @Input() countdown = 30;    // seconds left
  @Output() stayLoggedIn = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onStayLoggedIn() {
    this.stayLoggedIn.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}
