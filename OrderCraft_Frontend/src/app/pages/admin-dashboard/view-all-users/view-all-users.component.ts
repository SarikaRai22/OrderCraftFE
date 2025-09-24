



import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-view-all-users',
  templateUrl: './view-all-users.component.html',
  styleUrls: ['./view-all-users.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ViewAllUsersComponent implements OnInit {
  users: any[] = [];
  errorMessage = '';
  feedbackMessage = '';
  isSuccess = false;

  editingUser: any = null;
  editUserId: number | null = null;

  totalUsers = 0;
  adminCount = 0;
  poCount = 0;
  imCount = 0;
  pmCount = 0;


pendingDeleteUserId: number | null = null;
deletedUserBackup: any = null;
deleteTimeout: any = null;
showDeleteConfirm = false;
canUndo = false;


  roleOptions = [
  { roleId: 1, roleName: 'Admin' },
  { roleId: 2, roleName: 'Procurement Officer' },
  { roleId: 3, roleName: 'Inventory Manager' },
  { roleId: 4, roleName: 'Production Manager' }
];


  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
       const rolePriority: Record<string, number> = {
         'admin': 1,
          'po': 2,
          'im': 3,
          'pm': 4
      };


        this.users = data.sort((a, b) => {
          const aPriority = rolePriority[a.role?.roleName?.toLowerCase() ?? ''] ?? 99;
          const bPriority = rolePriority[b.role?.roleName?.toLowerCase() ?? ''] ?? 99;
          return aPriority - bPriority;
        });

        this.totalUsers = this.users.length;
        this.adminCount = this.users.filter(u => u.role?.roleName?.toLowerCase() === 'admin').length;
        this.poCount = this.users.filter(u => u.role?.roleName?.toLowerCase() === 'po').length;
        this.imCount = this.users.filter(u => u.role?.roleName?.toLowerCase() === 'im').length;
        this.pmCount = this.users.filter(u => u.role?.roleName?.toLowerCase() === 'pm').length;
      },
      error: () => {
        this.errorMessage = 'Failed to load users.';
      }
    });
  }

  getRoleLabel(roleName: string): string {
    switch (roleName?.toUpperCase()) {
      case 'ADMIN': return 'Admin';
      case 'PO': return 'Procurement Officer';
      case 'IM': return 'Inventory Manager';
      case 'PM': return 'Production Manager';
      default: return roleName;
    }
  }

onEdit(userId: number): void {
  const user = this.users.find(u => u.userId === userId);
  if (user) {
    this.editUserId = userId;

    const roleName = user.role?.roleName?.toLowerCase() || '';
    let roleId = 0;
    switch (roleName) {
      case 'admin':
        roleId = 1;
        break;
      case 'po':
        roleId = 2;
        break;
      case 'im':
        roleId = 3;
        break;
      case 'pm':
        roleId = 4;
        break;
    }

    this.editingUser = {
      userId: user.userId,
      userFullName: user.userFullName,
      userName: user.userName,
      userEmail: user.userEmail,
      userMobile: user.userMobile,
      userPassword: '', // leave blank
      role: {
        roleId: roleId,
        roleName: user.role?.roleName || ''
      },
      address: null // not needed
    };
  }
}

  saveEdit(): void {
  this.showConfirmation = true; // show confirmation modal
}

  cancelEdit(): void {
    this.editingUser = null;
    this.editUserId = null;
  }

  // onDelete(userId: number): void {
  //   if (confirm('Are you sure you want to delete this user?')) {
  //     this.userService.deleteUser(userId).subscribe({
  //       next: () => {
  //         this.feedbackMessage = 'User deleted successfully!';
  //         this.isSuccess = true;
  //         this.fetchUsers();
  //         setTimeout(() => (this.feedbackMessage = ''), 3000);
  //       },
  //       error: () => {
  //         this.feedbackMessage = 'Failed to delete user.';
  //         this.isSuccess = false;
  //         setTimeout(() => (this.feedbackMessage = ''), 3000);
  //       }
  //     });
  //   }
  // }


  onDelete(userId: number): void {
  this.pendingDeleteUserId = userId;
  this.showDeleteConfirm = true;
}

confirmDelete(): void {
  if (this.pendingDeleteUserId !== null) {
    // Backup user for undo
    this.deletedUserBackup = this.users.find(u => u.userId === this.pendingDeleteUserId);

    // Remove from users array
    this.users = this.users.filter(u => u.userId !== this.pendingDeleteUserId);

    this.feedbackMessage = 'User deleted successfully!';
    this.isSuccess = true;
    this.canUndo = true;

    // Wait 5s before actual deletion
    this.deleteTimeout = setTimeout(() => {
      this.userService.deleteUser(this.pendingDeleteUserId!).subscribe({
        next: () => {
          this.resetFeedback();
          this.fetchUsers(); // Optional refresh
        },
        error: () => {
          this.feedbackMessage = 'Failed to delete user.';
          this.isSuccess = false;
          setTimeout(() => this.resetFeedback(), 3000);
        }
      });
    }, 5000);
  }
  this.showDeleteConfirm = false;
}


cancelDelete(): void {
  this.pendingDeleteUserId = null;
  this.showDeleteConfirm = false;
}

undoDelete(): void {
  clearTimeout(this.deleteTimeout);
  if (this.deletedUserBackup) {
    this.users.push(this.deletedUserBackup);
    this.deletedUserBackup = null;
  }
  this.resetFeedback();
}


resetFeedback(): void {
  this.feedbackMessage = '';
  this.canUndo = false;
  this.pendingDeleteUserId = null;
  this.deletedUserBackup = null;
}


onRoleChange(newRoleId: number): void {
  const roleMap: any = {
    1: 'ADMIN',
    2: 'PO',
    3: 'IM',
    4: 'PM'
  };

  this.editingUser.role = {
    roleId: newRoleId,
    roleName: roleMap[newRoleId]
  };
}


showConfirmation: boolean = false;
private pendingSave: boolean = false;



// confirmSave(): void {
//   this.showConfirmation = false;

//   // Actual save logic
//   if (this.editUserId !== null) {
//     const updatedUser = this.editingUser;
//     this.userService.updateUser(this.editUserId, updatedUser).subscribe(
//       () => {
//         const index = this.users.findIndex(u => u.userId === this.editUserId);
//         if (index !== -1) {
//           this.users[index] = { ...updatedUser }; // update the local list
//         }
//         this.cancelEdit();
//       },
//       error => {
//         console.error('Error updating user:', error);
//       }
//     );
//   }
// }


confirmSave(): void {
  this.showConfirmation = false;

  if (this.editUserId !== null) {
    const updatedUser = this.editingUser;
    this.userService.updateUser(this.editUserId, updatedUser).subscribe(
      () => {
        const index = this.users.findIndex(u => u.userId === this.editUserId);
        if (index !== -1) {
          this.users[index] = { ...updatedUser };
        }
        this.cancelEdit();

        // ✅ Success feedback
        this.feedbackMessage = 'User details updated successfully!';
        this.isSuccess = true;
        setTimeout(() => this.resetFeedback(), 3000);
      },
      error => {
        console.error('Error updating user:', error);
        this.feedbackMessage = 'Failed to update user details.';
        this.isSuccess = false;
        setTimeout(() => this.resetFeedback(), 3000);
      }
    );
  }
}


cancelSave(): void {
  this.showConfirmation = false;
}


searchTerm: string = '';
selectedRole: string = '';




// Replace *ngFor="let user of users" with:
get filteredUsers() {
  const roleOrder: { [key: string]: number } = {
    'ADMIN': 1,
    'PO': 2,
    'IM': 3,
    'PM': 4
  };

  return this.users
    .filter(user =>
      (!this.selectedRole || user.role?.roleName === this.selectedRole) &&
      (!this.searchTerm || user.userName.toLowerCase().includes(this.searchTerm.toLowerCase()))
    )
    .sort((a, b) =>
      (roleOrder[a.role?.roleName ?? ''] ?? 999) - (roleOrder[b.role?.roleName ?? ''] ?? 999)
    );
}


}


