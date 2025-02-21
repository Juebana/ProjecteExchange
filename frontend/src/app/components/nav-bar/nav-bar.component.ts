import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from '../../models/user.dto';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'] 
})
export class NavBarComponent implements OnInit {
  user?: User;

  constructor(private router: Router) {}

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
  }

  logout(): void {
    localStorage.removeItem('user');
    console.log('Logout clicked');
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
