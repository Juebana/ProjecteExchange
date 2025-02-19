import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    if (!this.acceptedTerms) {
      alert('Please accept the terms and conditions.');
      return;
    }
    console.log(
      `Placing a ${this.isBuy ? 'BUY' : 'SELL'} order. 
       Type: ${this.isLimit ? 'Limit' : 'Market'}, 
       Price: ${this.price}, 
       Amount: ${this.amount} ${this.selectedCurrency}, 
       Terms accepted: ${this.acceptedTerms}`
    );
  }

  resetForm(): void {
    this.isBuy = true;
    this.isLimit = false;
    this.price = null;
    this.amount = null;
    this.selectedCurrency = 'usdc';
    this.acceptedTerms = false;
  }
}
