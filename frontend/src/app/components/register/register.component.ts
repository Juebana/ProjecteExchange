import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CustomAlertComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: User = new User('', '', '');
  confirmPassword: string = ''; // New variable for confirm password

  showAlert: boolean = false;
  alertMessage: string = '';
  registerSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  get isFormValid(): boolean {
    // Define password requirements: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isUsernameValid = this.user.username.trim() !== '';
    const isPasswordValid = passwordRegex.test(this.user.password);
    const doPasswordsMatch = this.user.password === this.confirmPassword;

    return isUsernameValid && isPasswordValid && doPasswordsMatch;
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      console.warn('Form is invalid.');
      let errorMessage = 'Please fix the following:';
      if (this.user.username.trim() === '') {
        errorMessage += ' Username is required.';
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.user.password)) {
        errorMessage += ' Password must be at least 8 characters, with an uppercase letter, lowercase letter, and number.';
      }
      if (this.user.password !== this.confirmPassword) {
        errorMessage += ' Passwords do not match.';
      }
      this.alertMessage = errorMessage;
      this.showAlert = true;
      this.registerSuccess = false;
      return;
    }

    try {
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
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  onAlertDismissed() {
    this.showAlert = false;
    if (this.registerSuccess) {
      this.router.navigate(['/login']);
    }
  }
}