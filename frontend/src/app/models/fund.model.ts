export class Fund {
    private _balance: number;
  
    constructor() {
      this._balance = 0;
    }
  
    get balance(): number {
      return this._balance;
    }
  
    set balance(value: number) {
      if (value < 0) {
        throw new Error('Balance cannot be negative');
      }
      this._balance = value;
    }
  }