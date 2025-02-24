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

  showAlert: boolean = false;
  alertMessage: string = '';
  registerSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  get isFormValid(): boolean {
    return this.user.username.trim() !== '' && this.user.password.trim() !== '';
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      console.warn('Username or password is missing.');
      this.alertMessage = 'Please fill in both username and password.';
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