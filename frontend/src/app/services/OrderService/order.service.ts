import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../../models/order.model';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderUrl = environment.orderUrl;

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<any> {
    const orderData = {
      userId: order.userId,
      tradeSide: order.tradeSide,
      tradeType: order.tradeType,
      price: order.tradeType === 'market' ? order.executionPrice : order.limitPrice,
      amount: order.amount,
      currency: order.currency
    };
    return this.http.post<any>(`${this.orderUrl}/postOrder`, orderData);
  }

  getActiveOrders(userId: string): Observable<Order[]> {
    const headers = new HttpHeaders({ 'user-id': userId });
    return this.http.get<any[]>(`${this.orderUrl}/activeOrders`, { headers }).pipe(
      map(orders => orders.map(o => Order.createOrder(
        o.id,
        o.userId,
        o.tradeSide,
        o.tradeType,
        o.price,
        o.limit_price,
        o.execution_price,
        o.amount,
        o.currency,
        o.status,
        o.created_at
      )))
    );
  }

  executeOrder(orderId: string, currentPrice: number, headers: HttpHeaders): Observable<any> {
    return this.http.post(`${this.orderUrl}/executeOrder`, { orderId, currentPrice }, { headers });
  }

  closeOrder(orderId: string, currentPrice: number, headers: HttpHeaders): Observable<any> {
    return this.http.post(`${this.orderUrl}/closeOrder`, { orderId, currentPrice }, { headers });
  }

  getOrderHistory(userId: string, page: number = 1): Observable<{ orders: any[], totalPages: number }> {
    const headers = new HttpHeaders({ 'user-id': userId });
    return this.http.get<{ orders: any[], totalPages: number }>(`${this.orderUrl}/orderHistory?page=${page}`, { headers });
  }
}