import { Component } from '@angular/core';

@Component({
  selector: 'app-buysell',
  standalone: true,
  imports: [],
  templateUrl: './buysell.component.html',
  styleUrl: './buysell.component.css'
})
export class BuySellComponent {
  isBuy: boolean = true;
  isLimit: boolean = false;
  price: number | null = null;
  amount: number | null = null;

  openTrade(): void {
    console.log(`Placing a ${this.isBuy ? 'BUY' : 'SELL'} order. Type: ${this.isLimit ? 'Limit' : 'Market'}, Price: ${this.price}, Amount: ${this.amount}`);
  }
}

