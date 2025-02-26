import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserDTO } from '../../models/user.dto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User | undefined;
  
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        this.user = UserDTO.fromJSONToUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
      }
    }
    if (this.user) {
      this.fetchBalance();
    }
  }
}
