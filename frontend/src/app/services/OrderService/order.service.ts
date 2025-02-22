import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderUrl = 'http://localhost:3000/order/postOrder';

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<any> {
    const orderData = {
      userId: order.userId,
      tradeSide: order.tradeSide,
      tradeType: order.tradeType,
      price: order.price,
      amount: order.amount,
      currency: order.currency
    };
    return this.http.post<any>(this.orderUrl, orderData);
  }
}
