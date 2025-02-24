import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

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
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          console.log('Registration successful.');
          alert('Registration successful! You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          alert('Registration failed. Please try again.');
        },
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}