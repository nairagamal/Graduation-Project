import { Component, OnInit } from '@angular/core';
import { User } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];


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
    // Find the index of the user in the array
    const index = this.users.findIndex(user => user.id === userId);
    if (index !== -1) {
      if (confirm("Are you sure you want to delete this user?")) {
        // Remove the user from the local array immediately
        this.users.splice(index, 1);
        // Make the HTTP request to delete the user from the server
        this.userService.deleteUser(userId).subscribe(response => {
          if (!response.success) {
            // If deletion fails, add the user back to the array
            this.getAllUsers(); // Refresh the array from the server
            console.error("Failed to delete user.");
          }
        });
      }
    }
  }

}
