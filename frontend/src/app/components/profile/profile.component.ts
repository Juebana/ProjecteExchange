import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserDTO } from '../../models/user.dto';
import { Fund } from '../../models/fund.model';
import { FundService } from '../../services/FundService/fund.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User | undefined;
  fund: Fund = new Fund();
  rechargeAmount: number = 0;
  showAlert: boolean = false;
  alertMessage: string = '';
  
  constructor(private fundService: FundService) {}

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
  
  fetchBalance(): void {
    if (!this.user) return;
    this.fundService.getBalance(this.user.id).subscribe({
      next: (response: { balance: number; }) => {
        this.fund.balance = response.balance;
      },
      error: (err: any) => {
        console.error('Error fetching balance:', err);
        this.showAlert = true;
        this.alertMessage = 'Failed to load balance.';
      }
    });
  }
}
