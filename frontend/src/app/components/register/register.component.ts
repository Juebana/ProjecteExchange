import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CustomAlertComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  get isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      console.warn('Username or password is missing.');
      this.alertMessage = 'Please fill in both username and password.';
      this.showAlert = true;
      return;
    }

    try {
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          console.log('Registration successful.');
          this.alertMessage = 'Registration successful! You can now log in.';
          this.showAlert = true;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.alertMessage = 'Registration failed. Please try again.';
          this.showAlert = true;
        },
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}