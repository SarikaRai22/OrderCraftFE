import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  submitted = false;

  roleOptions = [
    { roleId: 1, label: 'Administrator', value: 'ADMIN' },
    { roleId: 2, label: 'Procurement Officer', value: 'PO' },
    { roleId: 3, label: 'Inventory Manager', value: 'IM' },
    { roleId: 4, label: 'Production Manager', value: 'PM' }
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group({
      userFullName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      userName: ['', [Validators.required, Validators.minLength(4)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      userProfileImg: [''],
      role: this.fb.group({
        roleId: ['', Validators.required],
        roleName: ['', Validators.required]
      }),
      address: this.fb.group({
        addressStreet: [''],
        addressCity: [''],
        addressState: [''],
        addressPostalCode: [''],
        addressCountry: ['']
      })
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onRoleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const roleName = selectElement.value;

    const selected = this.roleOptions.find(opt => opt.value === roleName);
    if (selected) {
      this.registerForm.get('role')?.patchValue({
        roleId: selected.roleId,
        roleName: selected.value
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.valid) {
      this.userService.registerUser(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'User registered successfully!';
          this.errorMessage = '';
          this.registerForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed.';
          this.successMessage = '';
        }
      });

    } else {
      this.errorMessage = 'Please correct the errors in the form.';
      this.successMessage = '';
    }
  }

  isInvalid(controlPath: string): boolean {
    const control = this.registerForm.get(controlPath);
    return !!(control && control.touched && control.invalid);
  }

  isValid(controlPath: string): boolean {
    const control = this.registerForm.get(controlPath);
    return !!(control && control.touched && control.valid);
  }

  showError(controlPath: string, errorType: string): boolean {
    const control = this.registerForm.get(controlPath);
    return !!(control && control.touched && control.hasError(errorType));
  }
}
