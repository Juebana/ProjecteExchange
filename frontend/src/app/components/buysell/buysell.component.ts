import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buysell',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuySellComponent {
  isBuy: boolean = true;
  isLimit: boolean = false;
  price: number | null = null;
  amount: number | null = null;
  selectedCurrency: string = 'usdc';
  acceptedTerms: boolean = false; 

  openTrade(): void {
    console.log(
      `Placing a ${this.isBuy ? 'BUY' : 'SELL'} order. 
       Type: ${this.isLimit ? 'Limit' : 'Market'}, 
       Price: ${this.price}, 
       Amount: ${this.amount} ${this.selectedCurrency}, 
       Terms accepted: ${this.acceptedTerms}`
    );
  }
}
