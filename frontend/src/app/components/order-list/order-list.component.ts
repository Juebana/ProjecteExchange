import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../services/OrderService/order.service';
import { PriceService } from '../../services/PriceService/price.service';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { UserDTO } from '../../models/user.dto';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, CustomAlertComponent],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  activeTab: 'active' | 'history' = 'active';
  user?: User;
  activeOrders: Order[] = [];
  historyOrders: any[] = [];
  currentPrice: number | null = null;
  priceSubscription: Subscription | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(
    private orderService: OrderService,
    private priceService: PriceService
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      this.user = UserDTO.fromJSONToUser(parsedUser);
      this.fetchActiveOrders();
      this.startPriceSubscription();
    }
  }

  ngOnDestroy(): void {
    if (this.priceSubscription) {
      this.priceSubscription.unsubscribe();
    }
  }

  fetchActiveOrders(): void {
    if (this.user) {
      this.orderService.getActiveOrders(this.user.id).subscribe(orders => {
        this.activeOrders = orders;
      });
    }
  }

  startPriceSubscription(): void {
    this.priceSubscription = interval(5000).pipe(
      switchMap(() => this.priceService.getCurrentPrice('BTCUSDC'))
    ).subscribe(price => {
      this.currentPrice = price;
      this.checkPendingOrders();
      this.checkAutoCloseOrders();
    });
  }

  checkPendingOrders(): void {
    if (this.currentPrice === null || !this.user) return;
    const currentPrice = this.currentPrice; // TypeScript infers this as number
    const headers = new HttpHeaders({ 'user-id': this.user.id });
    this.activeOrders.filter(o => o.status === 'pending').forEach(order => {
      const limitPrice = order.limitPrice;
      if (limitPrice !== null && (
          (order.tradeSide === 'buy' && currentPrice <= limitPrice) ||
          (order.tradeSide === 'sell' && currentPrice >= limitPrice)
        )) {
        this.orderService.executeOrder(order.id, currentPrice, headers).subscribe(() => {
          this.fetchActiveOrders();
          this.alertMessage = `Order ${order.id} executed as market order.`;
          this.showAlert = true;
        });
      }
    });
  }

  calculatePNL(order: Order): number {
    if (this.currentPrice === null || order.status !== 'executed' || order.executionPrice === null) return 0;
    const entryPrice = order.executionPrice;
    const amount = order.amount;
    return order.tradeSide === 'buy'
      ? amount * (this.currentPrice / entryPrice - 1)
      : amount * (1 - this.currentPrice / entryPrice);
  }

  checkAutoCloseOrders(): void {
    if (this.currentPrice === null || !this.user) return;
    const currentPrice = this.currentPrice; // TypeScript infers this as number
    const headers = new HttpHeaders({ 'user-id': this.user.id });
    this.activeOrders.filter(o => o.status === 'executed').forEach(order => {
      const pnl = this.calculatePNL(order);
      if (pnl <= -order.amount) {
        this.orderService.closeOrder(order.id, currentPrice, headers).subscribe(() => {
          this.fetchActiveOrders();
          this.alertMessage = `Order ${order.id} auto-closed due to PNL reaching -${order.amount}.`;
          this.showAlert = true;
        });
      }
    });
  }

  closeOrder(order: Order): void {
    if (this.currentPrice === null || !this.user) return;
    const currentPrice = this.currentPrice; // TypeScript infers this as number
    const headers = new HttpHeaders({ 'user-id': this.user.id });
    this.orderService.closeOrder(order.id, currentPrice, headers).subscribe(() => {
      this.fetchActiveOrders();
      this.alertMessage = `Order ${order.id} closed successfully.`;
      this.showAlert = true;
    });
  }

  fetchOrderHistory(): void {
    if (this.user) {
      this.orderService.getOrderHistory(this.user.id, this.currentPage).subscribe(response => {
        this.historyOrders = response.orders;
        this.totalPages = response.totalPages;
      });
    }
  }

  dismissAlert(): void {
    this.showAlert = false;
  }
}