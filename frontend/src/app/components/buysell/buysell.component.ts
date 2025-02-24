import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/OrderService/order.service';
import { Order } from '../../models/order.model';
import { UserDTO } from '../../models/user.dto';
import { PriceService } from '../../services/PriceService/price.service';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-buysell',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuySellComponent {
  order: Order = Order.createOrder('', '', 'buy', 'market', null, 0, 'usdc');
  acceptedTerms: boolean = false;

  constructor(private orderService: OrderService, private priceService: PriceService) {}

  getMarketPrice(): Observable<number> {
    return this.priceService.getCurrentPrice('BTCUSDC');
  }

  async openTrade(): Promise<void> {
    if (!this.acceptedTerms) {
      alert('Please accept the terms and conditions.');
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
        alert('User data error.');
        return;
      }
    } else {
      alert('User not logged in.');
      return;
    }

    if (this.order.tradeType === 'market') {
      try {
        this.order.price = await firstValueFrom(this.getMarketPrice());
      } catch (error) {
        console.error('Failed to fetch market price:', error);
        alert('Failed to get market price. Please try again.');
        return;
      }
    } 

    else if (this.order.tradeType === 'limit') {
      if (this.order.price == null || this.order.price <= 0) {
        alert('Please enter a valid price for limit order.');
        return;
      }
    }

    this.orderService.createOrder(this.order).subscribe({
      next: () => {
        console.log('Order created successfully.');
        alert('Order successfully placed!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Order creation failed:', err);
        alert('Failed to place order. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.order = Order.createOrder('', '', 'buy', 'market', null, 0, 'usdc');
    this.acceptedTerms = false;
  }
}