export class Order {
    private _id: string;
    private _userId: string;
    private _tradeSide: 'buy' | 'sell';
    private _tradeType: 'market' | 'limit';
    private _price: number | null;
    private _amount: number;
    private _currency: string;
    private _createdAt?: string;
  
    constructor(
      id: string,
      userId: string,
      tradeSide: 'buy' | 'sell',
      tradeType: 'market' | 'limit',
      price: number | null,
      amount: number,
      currency: string,
      createdAt?: string
    ) {
      this._id = id;
      this._userId = userId;
      this._tradeSide = tradeSide;
      this._tradeType = tradeType;
      this._price = price;
      this._amount = amount;
      this._currency = currency;
      this._createdAt = createdAt;
    }
  
    get id(): string {
      return this._id;
    }
    set id(value: string) {
      this._id = value;
    }
  
    get userId(): string {
      return this._userId;
    }
    set userId(value: string) {
      this._userId = value;
    }
  
    get tradeSide(): 'buy' | 'sell' {
      return this._tradeSide;
    }
    set tradeSide(value: 'buy' | 'sell') {
      this._tradeSide = value;
    }
  
    get tradeType(): 'market' | 'limit' {
      return this._tradeType;
    }
    set tradeType(value: 'market' | 'limit') {
      this._tradeType = value;
    }
  
    get price(): number | null {
      return this._price;
    }
    set price(value: number | null) {
      this._price = value;
    }
  
    get amount(): number {
      return this._amount;
    }
    set amount(value: number) {
      this._amount = value;
    }
  
    get currency(): string {
      return this._currency;
    }
    set currency(value: string) {
      this._currency = value;
    }
  
    get createdAt(): string | undefined {
      return this._createdAt;
    }
    set createdAt(value: string | undefined) {
      this._createdAt = value;
    }
  }
  