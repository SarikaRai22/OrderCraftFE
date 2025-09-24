import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userForm!: FormGroup;
  profileImageUrl: SafeUrl = 'assets/default-profile.png';

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      userFullName: [{ value: '', disabled: true }],
      userEmail: [{ value: '', disabled: true }],
      userMobile: [{ value: '', disabled: true }],
      userName: [{ value: '', disabled: true }],
      roleName: [{ value: '', disabled: true }],
      addressStreet: [{ value: '', disabled: true }],
      addressCity: [{ value: '', disabled: true }],
      addressState: [{ value: '', disabled: true }],
      addressPostalCode: [{ value: '', disabled: true }],
      addressCountry: [{ value: '', disabled: true }]
    });
  }

  loadUserData(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.sub;

    this.userService.getUserByUsername(username).subscribe({
      next: (data) => {
        this.userForm.patchValue({
          userFullName: data.userFullName,
          userEmail: data.userEmail,
          userMobile: data.userMobile,
          userName: data.userName,
          roleName: data.role?.roleName,
          addressStreet: data.address?.addressStreet,
          addressCity: data.address?.addressCity,
          addressState: data.address?.addressState,
          addressPostalCode: data.address?.addressPostalCode,
          addressCountry: data.address?.addressCountry
        });

        if (data.userProfileImg) {
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(
            `http://localhost:8085/uploads/${data.userProfileImg}`
          );
        }
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }

  goToEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }
}
