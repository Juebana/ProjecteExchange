import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  private binanceApiUrl = 'https://api.binance.com/api/v3/ticker/price';

  constructor(private http: HttpClient) {}

  getCurrentPrice(symbol: string): Observable<number> {
    return this.http.get<{ symbol: string; price: string }>(`${this.binanceApiUrl}?symbol=${symbol}`).pipe(
      map(response => parseFloat(response.price))
    );
  }
}