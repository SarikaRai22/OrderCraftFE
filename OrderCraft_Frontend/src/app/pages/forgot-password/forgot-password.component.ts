import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginAttemptService } from '../../services/login-attempt.service';

@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  step = 1;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  isLoading = false;
  
  forgotForm: FormGroup;
  verifyForm: FormGroup;
  resetForm: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router, private loginAttempt: LoginAttemptService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.verifyForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  get f() { return this.forgotForm.controls; }
  get v() { return this.verifyForm.controls; }
  get r() { return this.resetForm.controls; }

  requestOtp() {
    if (this.forgotForm.invalid) {
      this.showMessage('Please enter a valid email address', 'error');
      return;
    }

    this.isLoading = true;
    const email = this.forgotForm.value.email;
    
    this.auth.requestOtp(email).subscribe({
      next: (res: any) => {
        this.showMessage(res.message || 'OTP sent to your email', 'success');
        this.step = 2;
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error requesting OTP. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }

  verifyOtp() {
    if (this.verifyForm.invalid) {
      this.showMessage('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    this.isLoading = true;
    const email = this.forgotForm.value.email;
    const otp = this.verifyForm.value.otp;
    
    this.auth.verifyOtp(email, otp).subscribe({
      next: (res: any) => {
        this.showMessage(res.message || 'OTP verified successfully', 'success');
        this.step = 3;
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Invalid OTP. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      if (this.resetForm.hasError('mismatch')) {
        this.showMessage('Passwords do not match', 'error');
      } else {
        this.showMessage('Please enter a valid password (min 8 characters)', 'error');
      }
      return;
    }

    this.isLoading = true;
    const email = this.forgotForm.value.email;
    const newPassword = this.resetForm.value.newPassword;

    this.auth.resetPassword(email, newPassword).subscribe({
      next: (res: any) => {
        this.showMessage(res.message || 'Password reset successfully!', 'success');

        // ✅ Clear lockout for email
        this.loginAttempt.reset(email);

        if (res.username && res.username !== email) {
          this.loginAttempt.reset(res.username);
        }

        this.step = 4;
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Failed to reset password. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  
}