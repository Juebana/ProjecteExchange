import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CustomAlertComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  user: User = new User('', '', '');
  confirmPassword: string = '';
  passwordPattern = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}');

  showAlert: boolean = false;
  alertMessage: string = '';
  registerSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {

    this.user.username = this.user.username.trim();
    this.user.password = this.user.password.trim();
    this.confirmPassword = this.confirmPassword.trim();

    console.log('Password:', this.user.password, 'Confirm:', this.confirmPassword);

    let errorMessage = 'Please fix the following:';
    let hasErrors = false;

    if (form.invalid) {
      if (!this.user.username) {
        errorMessage += ' Username is required.';
        hasErrors = true;
      }
      if (!this.passwordPattern.test(this.user.password)) {
        errorMessage += ' Password must be at least 8 characters, with an uppercase letter, lowercase letter, and number.';
        hasErrors = true;
      }
    }

    if (this.user.password !== this.confirmPassword) {
      errorMessage += ' Passwords do not match.';
      hasErrors = true;
    }

    if (hasErrors) {
      console.warn('Form submission failed:', errorMessage);
      this.alertMessage = errorMessage;
      this.showAlert = true;
      this.registerSuccess = false;
      return;
    }

    this.authService.register(this.user.username, this.user.password).subscribe({
      next: () => {
        console.log('Registration successful.');
        this.alertMessage = 'Registration successful! You can now log in.';
        this.showAlert = true;
        this.registerSuccess = true;
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.alertMessage = 'Registration failed. Please try again.';
        this.showAlert = true;
        this.registerSuccess = false;
      },
    });
  }

  onAlertDismissed() {
    this.showAlert = false;
    if (this.registerSuccess) {
      this.router.navigate(['/login']);
    }
  }
}