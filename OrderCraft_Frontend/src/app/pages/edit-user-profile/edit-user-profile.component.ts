import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf, NgClass],
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css'],
})
export class EditUserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private sanitizer = inject(DomSanitizer);

  @Output() closed = new EventEmitter<void>();

  editForm!: FormGroup;
  isLoading = false;
  message = '';
  profileImageUrl: SafeUrl = 'assets/default-profile.png';

  ngOnInit(): void {
    this.editForm = this.fb.group({
      userFullName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userMobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      userName: ['', Validators.required],
      roleName: [{ value: '', disabled: true }],

      addressStreet: [''],
      addressCity: [''],
      addressState: [''],
      addressPostalCode: [''],
      addressCountry: [''],

      newPassword: [''],
      confirmPassword: ['']
    });

    this.loadProfileData();
  }

  loadProfileData(): void {
    this.isLoading = true;

    const token = localStorage.getItem('token');
    if (!token) {
      this.message = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.sub;

    this.userService.getUserByUsername(username).subscribe({
      next: (data) => {
        this.editForm.patchValue({
          userFullName: data.userFullName,
          userEmail: data.userEmail,
          userMobile: data.userMobile,
          userName: data.userName,
          roleName: data.role?.roleName || '',
          addressStreet: data.address?.addressStreet || '',
          addressCity: data.address?.addressCity || '',
          addressState: data.address?.addressState || '',
          addressPostalCode: data.address?.addressPostalCode || '',
          addressCountry: data.address?.addressCountry || ''
        });

        if (data.userProfileImg) {
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(
            `http://localhost:8085/uploads/${data.userProfileImg}`
          );
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.message = 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.message = 'Please correct the form errors.';
      return;
    }

    const { newPassword, confirmPassword, ...rest } = this.editForm.getRawValue();

    if (newPassword && newPassword !== confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    const updatePayload = {
      ...rest,
      newPassword: newPassword
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.isLoading = true;

    this.http.put('http://localhost:8085/api/users/update-profile', updatePayload, { headers }).subscribe({
      next: () => {
        this.message = 'Profile updated successfully';
        this.isLoading = false;
        this.closed.emit();
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.message = err.error || 'Failed to update profile';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.closed.emit();
  }
}
