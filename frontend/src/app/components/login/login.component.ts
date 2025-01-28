import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private authService: AuthService) {}

  get isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }

  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.token = response.token;
        localStorage.setItem('token', this.token!); 
        alert('Login successful!');
        // Optionally, redirect the user or perform other actions
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

  async onSubmit(): Promise<void> {
    if (this.isFormValid) {
      if (this.isRegistration) {
        this.register(this.username, this.password);
      } else {
        this.login(this.username, this.password);
      }
    } else {
      console.warn('Username or password is missing.');
      alert('Please fill in both username and password.');
    }
  }
}
