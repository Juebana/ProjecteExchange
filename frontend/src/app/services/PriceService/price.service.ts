import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  private binanceApiUrl = environment.priceUrl;

  constructor(private http: HttpClient) {}

  getCurrentPrice(symbol: string): Observable<number> {
    return this.http.get<{ symbol: string; price: string }>(`${this.binanceApiUrl}?symbol=${symbol}`).pipe(
      map(response => parseFloat(response.price))
    );
  }
}