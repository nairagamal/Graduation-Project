import { Component, OnInit } from '@angular/core';
import { User } from '../models/models';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  editingUser: User | null = null; // Declare editingUser as potentially null
  showAddUserForm: boolean = false;
  userFormSubmitted: boolean = false; // Flag to track form submission
  newUser: User = { // Initialize an empty user object to bind form inputs
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    mobile: '',
    password: '',
    createdAt: '',
    modifiedAt: ''
  };

  constructor(private userService: UtilityService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  deleteUser(userId: number): void {
    const index = this.users.findIndex(user => user.id === userId);
    if (index !== -1) {
      if (confirm("Are you sure you want to delete this user?")) {
        this.users.splice(index, 1);
        this.userService.deleteUser(userId).subscribe(response => {
          if (!response.success) {
            this.getAllUsers();
            console.error("Failed to delete user.");
          }
        });
      }
    }
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.editingUser = { ...user }; // Create a copy for editing
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.editingUser = null; // Reset editingUser to null
  }

  saveUserChanges(): void {
    this.userFormSubmitted = true; // Set form submission flag to true
    if (this.editingUser) {
      if (this.isValidForm()) {
        // Update the user in the list locally
        const index = this.users.findIndex(user => user.id === this.editingUser?.id);
        if (index !== -1) {
          this.users[index] = { ...this.editingUser! };
        }

        // Send request to update user on the server
        this.userService.editUser(this.editingUser.id, this.editingUser).subscribe(response => {
          if (response) {
            // If response is successful, no further action needed
            this.selectedUser = null;
            this.editingUser = null;
            console.log("User updated successfully.");
          } else {
            // If response is unsuccessful, revert the change in the local list
            this.users[index] = { ...this.selectedUser! };
            console.error("Failed to save user changes.");
          }
        });
      }
    }
  }


  isValidForm(): boolean {
    // Check if any input field is empty or if the mobile number doesn't meet the required pattern
    return !(
      !this.editingUser?.firstName ||
      !this.editingUser?.lastName ||
      !this.editingUser?.email ||
      !this.editingUser?.address ||
      !this.editingUser?.mobile ||
      !this.isValidMobile(this.editingUser?.mobile) // Check mobile number pattern
    );
  }

  isValidMobile(mobile: string | undefined): boolean {
    // Check mobile number pattern
    const mobilePattern = /^(012|011|015)[0-9]{8}$/;
    return !!mobile && mobilePattern.test(mobile);
  }




  toggleAddUserForm(): void {
    this.showAddUserForm = !this.showAddUserForm;
    // Reset newUser object when hiding the form
    if (!this.showAddUserForm) {
      this.resetNewUser();
    }
  }

  resetNewUser(): void {
    // Reset newUser object to clear form inputs
    this.newUser = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      mobile: '',
      password: '',
      createdAt: '',
      modifiedAt: ''
    };
  }

  addUser(): void {
    // Add new user to the list locally
    this.users.push(this.newUser);

    // Add new user to the database
    this.userService.addUser(this.newUser).subscribe(response => {
      if (response) {
        // If response is successful, no further action needed
        console.log("User added successfully.");
      } else {
        // If response is unsuccessful, remove the user from the list
        this.users.pop();
        console.error("Failed to add user.");
      }

      // Reset the newUser object and hide the Add User form
      this.resetNewUser();
      this.toggleAddUserForm();
    });
  }

}
