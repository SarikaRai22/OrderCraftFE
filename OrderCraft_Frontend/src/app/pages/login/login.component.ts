import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';  // ✅ Captcha
import { HttpClient } from '@angular/common/http';

import { LoginAttemptService } from '../../services/login-attempt.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, RecaptchaModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  message = '';
  captchaToken: string | null = null;   // ✅ Captcha result
  isAccountLocked = false;              // ✅ Track lock state

  constructor(
    private auth: AuthService,
    private router: Router,
    private loginAttempt: LoginAttemptService,
    private route: ActivatedRoute,
    private http: HttpClient         // ✅ Added for unlock request
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired']) {
        this.message = 'Session expired due to inactivity. Please login again.';
      }
    });
  }

  // ✅ Captcha callback
  onCaptchaResolved(token: string | null, captchaRef: RecaptchaComponent) {
    this.captchaToken = token;

    if (token) {
      // Refresh captcha automatically after 2 seconds
      setTimeout(() => {
        captchaRef.reset();   // reset captcha
        this.captchaToken = null; // disable login button again
        console.log('Captcha refreshed');
      }, 5000);
    }
  }

  // ✅ Final merged login
  login() {
    const user = this.username.trim().toLowerCase();

    // 🔎 Basic validations
    if (!user || !this.password.trim()) {
      this.message = 'Please enter both email and password.';
      this.isAccountLocked = false;
      return;
    }

    if (!this.captchaToken) {
      this.message = 'Please complete the captcha.';
      this.isAccountLocked = false;
      return;
    }

    // Check lock before login
    if (this.loginAttempt.isLocked(user)) {
      this.message = 'Account is temporarily locked due to multiple failed attempts. Please try again after 24 hours.';
      this.isAccountLocked = true; // show unlock link
      return;
    }

    // ✅ Call backend
    this.auth.login({ username: user, password: this.password, captchaToken: this.captchaToken })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);

          const roles: string[] = res.roles;

          // Reset lock on success
          this.loginAttempt.reset(user);
          this.isAccountLocked = false;

          // Redirect based on role
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin-dashboard']);
          } else if (roles.includes('ROLE_PO')) {
            this.router.navigate(['/po-dashboard']);
          } else if (roles.includes('ROLE_PM')) {
            this.router.navigate(['/pm-dashboard']);
          } else if (roles.includes('ROLE_IM')) {
            this.router.navigate(['/im-dashboard']);
          } else {
            this.router.navigate(['/unauthorized']);
          }

          this.message = 'Login successful!';
        },
        error: (err) => {
          const status = err.status;
          const isAuthError = status === 401 || status === 403;

          if (isAuthError) {
            // Record failed attempt
            this.message = this.loginAttempt.recordFailure(user);

            if (this.loginAttempt.isLocked(user)) {
              this.isAccountLocked = true;
            }
          } else {
            this.message = 'Login failed. Please try again later.';
            this.isAccountLocked = false;
          }
        }
      });
  }

  // 🔓 Unlock request
  requestUnlock(event: Event) {
    event.preventDefault();

    const user = this.username.trim().toLowerCase();
    if (!user) {
      this.message = 'Please enter your email above first.';
      return;
    }

    this.http.post('http://localhost:8085/auth/request-unlock', null, {
      params: { username: user },
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.message = 'Unlock request sent to admin.';
      },
      error: () => {
        this.message = 'Error sending unlock request. Try again later.';
      }
    });
  }
}
