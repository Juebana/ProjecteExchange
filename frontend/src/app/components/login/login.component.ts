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

  constructor(private authService: AuthService) {}

  get isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }

  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Handle token storage or redirection here
      },
      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }

  async onSubmit(): Promise<void> {
    if (this.username && this.password) {
      try {
        const response = await this.authService.login(this.username, this.password).toPromise();
        this.token = response.token;
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else {
      console.warn('Username or password is missing.');
    }
  }  
  
}
