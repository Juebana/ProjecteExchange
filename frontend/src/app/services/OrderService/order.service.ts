import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<any>(this.orderUrl, orderData).pipe(
      map(response => new Order(
        response.id,
        response.userId,
        response.tradeSide,
        response.tradeType,
        response.price,
        response.amount,
        response.currency,
        response.created_at
      ))
    );
  }
}
