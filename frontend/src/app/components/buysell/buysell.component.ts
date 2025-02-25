import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/OrderService/order.service';
import { Order } from '../../models/order.model';
import { UserDTO } from '../../models/user.dto';
import { PriceService } from '../../services/PriceService/price.service';
import { firstValueFrom, Observable } from 'rxjs';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';

@Component({
  selector: 'app-buysell',
  standalone: true,
  imports: [FormsModule, CommonModule, CustomAlertComponent],
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuySellComponent {
  order: Order = Order.createOrder('', '', 'buy', 'market', null, 0, 'usdc');
  acceptedTerms: boolean = false;

  showAlert: boolean = false;
  alertMessage: string = '';
  orderSuccess: boolean = false;

  constructor(private orderService: OrderService, private priceService: PriceService) {}

  getMarketPrice(): Observable<number> {
    return this.priceService.getCurrentPrice('BTCUSDC');
  }

  async openTrade(): Promise<void> {
    if (!this.acceptedTerms) {
      this.alertMessage = 'Please accept the terms and conditions.';
      this.showAlert = true;
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userDto = JSON.parse(storedUser);
        const user = UserDTO.fromJSONToUser(userDto);
        this.order.userId = user.id;
      } catch (e) {
        console.error('Error parsing user data', e);
        this.alertMessage = 'User data error.';
        this.showAlert = true;
        return;
      }
    } else {
      this.alertMessage = 'User not logged in.';
      this.showAlert = true;
      return;
    }

    if (this.order.tradeType === 'market') {
      try {
        this.order.price = await firstValueFrom(this.getMarketPrice());
      } catch (error) {
        console.error('Failed to fetch market price:', error);
        this.alertMessage = 'Failed to get market price. Please try again.';
        this.showAlert = true;
        return;
      }
    } 

    else if (this.order.tradeType === 'limit') {
      if (this.order.price == null || this.order.price <= 0) {
        this.alertMessage = 'Please enter a valid price for limit order.';
        this.showAlert = true;
        return;
      }
    }

    this.orderService.createOrder(this.order).subscribe({
      next: () => {
        console.log('Order created successfully.');
        this.alertMessage = 'Order successfully placed!';
        this.showAlert = true;
      },
      error: (err) => {
        console.error('Order creation failed:', err);
        this.alertMessage = 'Failed to place order. Please try again.';
        this.showAlert = true;
      }
    });
  }

  resetForm(): void {
    this.order = Order.createOrder('', '', 'buy', 'market', null, 0, 'usdc');
    this.acceptedTerms = false;
    this.alertMessage = 'Form reseted!';
    this.showAlert = true;
  }
}