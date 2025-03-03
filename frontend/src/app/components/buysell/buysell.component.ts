import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/OrderService/order.service';
import { Order } from '../../models/order.model';
import { User } from '../../models/user.model';
import { UserDTO } from '../../models/user.dto';
import { PriceService } from '../../services/PriceService/price.service';
import { FundService } from '../../services/FundService/fund.service';
import { Fund } from '../../models/fund.model';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { RouterModule, Router } from '@angular/router';
import { OrderNotificationService } from '../../services/OrderNotification/order-notification.service';

@Component({
  selector: 'app-buysell',
  standalone: true,
  imports: [FormsModule, CommonModule, CustomAlertComponent, RouterModule],
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuySellComponent implements OnInit, OnDestroy {
  order: Order = Order.createOrder('', '', 'buy', 'market', null, null, null, 0, 'usdc', 'pending');
  acceptedTerms: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  orderSuccess: boolean = false;
  isProcessing: boolean = false;

  user: User | null = null;
  fund: Fund = new Fund();
  private balanceUpdateSubscription: Subscription | null = null;

  constructor(
    private orderService: OrderService,
    private priceService: PriceService,
    private fundService: FundService,
    private router: Router,
    private orderNotificationService: OrderNotificationService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userJson = JSON.parse(storedUser);
        this.user = UserDTO.fromJSONToUser(userJson);
        this.order.userId = this.user.id;
        this.fetchBalance();
        this.balanceUpdateSubscription = this.orderNotificationService.balanceUpdate$.subscribe(() => {
          this.fetchBalance();
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

  ngOnDestroy(): void {
    if (this.balanceUpdateSubscription) {
      this.balanceUpdateSubscription.unsubscribe();
    }
  }

  private fetchBalance(): void {
    if (this.user) {
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

    this.isProcessing = true;

    try {
      if (this.order.tradeType === 'market') {
        const currentPrice = await firstValueFrom(this.getMarketPrice());
        this.order.executionPrice = currentPrice;
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

      await firstValueFrom(this.orderService.createOrder(this.order));
      console.log('Order created successfully.');
      this.alertMessage = 'Order successfully placed!';
      this.showAlert = true;
      this.orderSuccess = true;

      try {
        const response = await firstValueFrom(this.fundService.subtractFunds(this.user!.id, this.order.amount));
        this.fund.balance = response.newBalance;
        this.orderNotificationService.notifyBalanceUpdate();
      } catch (fundErr) {
        console.error('Fund operation failed:', fundErr);
        this.alertMessage = 'Order placed, but failed to update balance.';
        this.showAlert = true;
      }

      this.orderNotificationService.notifyOrderPlaced();
    } catch (err) {
      console.error('Order creation failed:', err);
      this.alertMessage = 'Failed to place order. Please try again.';
      this.showAlert = true;
    } finally {
      this.isProcessing = false;
    }
  }

  resetForm(): void {
    this.order = Order.createOrder('', '', 'buy', 'market', null, null, null, 0, 'usdc', 'pending');
    this.acceptedTerms = false;
    this.alertMessage = 'Form reset!';
    this.showAlert = true;
    this.orderSuccess = false;
  }
}