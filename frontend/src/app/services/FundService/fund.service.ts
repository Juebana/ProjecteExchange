import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class FundService {
  private apiUrl = environment.fundUrl;

  constructor(private http: HttpClient) {}

  getBalance(userId: string): Observable<{ balance: number }> {
    const headers = new HttpHeaders({ 'user-id': userId });
    return this.http.get<{ balance: number }>(`${this.apiUrl}/balance`, { headers });
  }

  rechargeFunds(userId: string, amount: number): Observable<{ message: string, newBalance: number }> {
    const headers = new HttpHeaders({ 'user-id': userId });
    return this.http.post<{ message: string, newBalance: number }>(`${this.apiUrl}/recharge`, { amount }, { headers });
  }

  subtractFunds(userId: string, amount: number): Observable<{ message: string, newBalance: number }> {
    const headers = new HttpHeaders({ 'user-id': userId });
    return this.http.post<{ message: string, newBalance: number }>(`${this.apiUrl}/subtract`, { amount }, { headers });
  }
}