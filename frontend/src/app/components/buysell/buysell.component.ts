import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/OrderService/order.service';
import { Order } from '../../models/order.model';
import { User } from '../../models/user.model';
import { UserDTO } from '../../models/user.dto';
import { PriceService } from '../../services/PriceService/price.service';
import { FundService } from '../../services/FundService/fund.service';
import { Fund } from '../../models/fund.model';
import { firstValueFrom, Observable } from 'rxjs';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-buysell',
  standalone: true,
  imports: [FormsModule, CommonModule, CustomAlertComponent, RouterModule],
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuySellComponent implements OnInit {
  order: Order = Order.createOrder('', '', 'buy', 'market', null, null, null, 0, 'usdc', 'pending');
  acceptedTerms: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  orderSuccess: boolean = false;

  user: User | null = null;
  fund: Fund = new Fund();

  constructor(
    private orderService: OrderService,
    private priceService: PriceService,
    private fundService: FundService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userJson = JSON.parse(storedUser);
        this.user = UserDTO.fromJSONToUser(userJson);
        this.order.userId = this.user.id;
        this.fundService.getBalance(this.user.id).subscribe({
          next: (response) => {
            this.fund.balance = response.balance;
          },
          error: (err) => {
            console.error('Error fetching balance:', err);
            this.alertMessage = 'Failed to load balance.';
            this.showAlert = true;
          }
        });
      } catch (e) {
        console.error('Error parsing user data', e);
        this.alertMessage = 'User data error.';
        this.showAlert = true;
      }
    } else {
      this.alertMessage = 'User not logged in.';
      this.showAlert = true;
      this.router.navigate(['/login']);
    }
  }

  getMarketPrice(): Observable<number> {
    return this.priceService.getCurrentPrice('BTCUSDC');
  }

  async openTrade(): Promise<void> {
    if (!this.acceptedTerms) {
      this.alertMessage = 'Please accept the terms and conditions.';
      this.showAlert = true;
      return;
    }
  
    if (!this.user) {
      this.alertMessage = 'User not logged in.';
      this.showAlert = true;
      return;
    }
  
    if (this.order.tradeType === 'market') {
      try {
        const currentPrice = await firstValueFrom(this.getMarketPrice());
        this.order.executionPrice = currentPrice;
      } catch (error) {
        console.error('Failed to fetch market price:', error);
        this.alertMessage = 'Failed to get market price. Please try again.';
        this.showAlert = true;
        return;
      }
    } else if (this.order.tradeType === 'limit') {
      if (this.order.price == null || this.order.price <= 0) {
        this.alertMessage = 'Please enter a valid price for limit order.';
        this.showAlert = true;
        return;
      }
      this.order.limitPrice = this.order.price;
    }
  
    if (this.order.amount > this.fund.balance) {
      this.alertMessage = 'Insufficient balance to place this order.';
      this.showAlert = true;
      return;
    }
  
    this.orderService.createOrder(this.order).subscribe({
      next: () => {
        console.log('Order created successfully.');
        this.alertMessage = 'Order successfully placed!';
        this.showAlert = true;
        this.orderSuccess = true;
  
        if (this.order.tradeSide === 'buy') {
          this.fundService.subtractFunds(this.user!.id, this.order.amount).subscribe({
            next: (response) => {
              this.fund.balance = response.newBalance;
            },
            error: (err) => {
              console.error('Error subtracting funds:', err);
              this.alertMessage = 'Order placed, but failed to update balance.';
              this.showAlert = true;
            }
          });
        } else if (this.order.tradeSide === 'sell') {
          this.fundService.subtractFunds(this.user!.id, this.order.amount).subscribe({
            next: (response) => {
              this.fund.balance = response.newBalance;
            },
            error: (err) => {
              console.error('Error adding funds:', err);
              this.alertMessage = 'Order placed, but failed to update balance.';
              this.showAlert = true;
            }
          });
        }
      },
      error: (err) => {
        console.error('Order creation failed:', err);
        this.alertMessage = 'Failed to place order. Please try again.';
        this.showAlert = true;
      }
    });
  }

  resetForm(): void {
    this.order = Order.createOrder('', '', 'buy', 'market', null, null, null, 0, 'usdc', 'pending');
    this.acceptedTerms = false;
    this.alertMessage = 'Form reset!';
    this.showAlert = true;
    this.orderSuccess = false;
  }
}