import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CustomAlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user: User = new User('', '', '');
  token: string | null = null;

  showAlert: boolean = false;
  alertMessage: string = '';
  loginSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  get isFormValid(): boolean {
    return this.user.username.trim() !== '' && this.user.password.trim() !== '';
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      console.warn('Username or password is missing.');
      this.alertMessage = 'Please fill in both username and password.';
      this.showAlert = true;
      this.loginSuccess = false;
      return;
    }

    try {
      this.authService.login(this.user.username, this.user.password).subscribe({
        next: (user: User) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.token = user.token ?? null;
          this.alertMessage = 'Login successful! Redirecting to dashboard...';
          this.showAlert = true;
          this.loginSuccess = true;
        },
        error: (err) => {
          this.alertMessage = 'Login failed. Please check your credentials.';
          this.showAlert = true;
          this.loginSuccess = false;
        },
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  onAlertDismissed() {
    this.showAlert = false;
    if (this.loginSuccess) {
      this.router.navigate(['/dashboard']);
    }
  }
}