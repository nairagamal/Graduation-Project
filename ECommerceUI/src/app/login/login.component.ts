import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message = '';
  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private utilityService: UtilityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ],
      ],
    });
    this.resetForm();
  }

  login() {
    if (this.loginForm.valid) {
      const email = this.Email.value;
      const password = this.PWD.value;

      // Check if email and password match the admin credentials
      if (email === 'admin@gmail.com' && password === '123456') {
        // Redirect to admin component
        this.router.navigate(['/admin']);
        return; // Exit the function to prevent further execution
      }

      // If not admin credentials, proceed with regular login
      this.navigationService
        .loginUser(email, password)
        .subscribe((res: any) => {
          if (res.toString() !== 'invalid') {
            this.message = 'Logged In Successfully.';
            this.utilityService.setUser(res.toString());
            console.log(this.utilityService.getUser());
            this.router.navigate(['/home']); // Redirect to home page
          } else {
            this.message = 'Invalid Email or Paswword';
          }
        });
    }
  }

  resetForm() {
    this.loginForm.reset();
  }

  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }
}
