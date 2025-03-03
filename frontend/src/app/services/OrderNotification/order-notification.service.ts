import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderNotificationService {
  private orderPlacedSource = new Subject<void>();
  orderPlaced$ = this.orderPlacedSource.asObservable();

  notifyOrderPlaced() {
    this.orderPlacedSource.next();
  }
}