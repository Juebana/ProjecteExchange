import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  get isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }

  login(username: string, password: string): void {
    console.log('Logging in with', username, password);
    // Placeholder: This will be implemented to handle the backend call.
  }
}
