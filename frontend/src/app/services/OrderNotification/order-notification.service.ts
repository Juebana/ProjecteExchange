import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderNotificationService {
  private orderPlacedSource = new Subject<void>();
  orderPlaced$ = this.orderPlacedSource.asObservable();

  private balanceUpdateSource = new Subject<void>();
  balanceUpdate$ = this.balanceUpdateSource.asObservable();

  notifyOrderPlaced(): void {
    this.orderPlacedSource.next();
  }

  notifyBalanceUpdate(): void {
    this.balanceUpdateSource.next();
  }
}