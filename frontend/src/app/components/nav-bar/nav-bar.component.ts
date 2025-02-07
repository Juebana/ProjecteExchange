import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'] 
})
export class NavBarComponent implements OnInit {
  username: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const user = new User(parsedUser._username, parsedUser._password, parsedUser._token);
        this.username = user.username;
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
