import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sda-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  token: string | null = null;
  isRegistration: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  get isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }

  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe({
      next: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.token = user.token ?? null;
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials.');
      },
    });
  }

  register(username: string, password: string): void {
    this.authService.register(username, password).subscribe({
      next: () => {
        console.log('Registration successful.');
        alert('Registration successful! You can now log in.');
        this.isRegistration = false;
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      console.warn('Username or password is missing.');
      alert('Please fill in both username and password.');
      return;
    }

    try {
      if (this.isRegistration) {
        this.register(this.username, this.password);
      } else {
        this.login(this.username, this.password);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}
