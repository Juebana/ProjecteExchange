import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  token: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  get isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      console.warn('Username or password is missing.');
      alert('Please fill in both username and password.');
      return;
    }

    try {
      this.authService.login(this.username, this.password).subscribe({
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
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}