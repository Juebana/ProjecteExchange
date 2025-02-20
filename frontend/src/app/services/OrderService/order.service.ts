import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderData: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.orderUrl, orderData);
  }
}
