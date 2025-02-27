export class Order {
  constructor(
    private _id: string,
    private _userId: string,
    private _tradeSide: 'buy' | 'sell',
    private _tradeType: 'market' | 'limit',
    private _price: number | null,
    private _limitPrice: number | null,
    private _executionPrice: number | null,
    private _amount: number,
    private _currency: string,
    private _status: 'pending' | 'executed',
    private _createdAt?: string
  ) {}

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get userId(): string { return this._userId; }
  set userId(value: string) { this._userId = value; }

  get tradeSide(): 'buy' | 'sell' { return this._tradeSide; }
  set tradeSide(value: 'buy' | 'sell') { this._tradeSide = value; }

  get tradeType(): 'market' | 'limit' { return this._tradeType; }
  set tradeType(value: 'market' | 'limit') { this._tradeType = value; }

  get price(): number | null { return this._price; }
  set price(value: number | null) { this._price = value; }

  get limitPrice(): number | null { return this._limitPrice; }
  set limitPrice(value: number | null) { this._limitPrice = value; }

  get executionPrice(): number | null { return this._executionPrice; }
  set executionPrice(value: number | null) { this._executionPrice = value; }

  get amount(): number { return this._amount; }
  set amount(value: number) { this._amount = value; }

  get currency(): string { return this._currency; }
  set currency(value: string) { this._currency = value; }

  get status(): 'pending' | 'executed' { return this._status; }
  set status(value: 'pending' | 'executed') { this._status = value; }

  get createdAt(): string | undefined { return this._createdAt; }
  set createdAt(value: string | undefined) { this._createdAt = value; }

  static createOrder(
    id: string,
    userId: string,
    tradeSide: 'buy' | 'sell',
    tradeType: 'market' | 'limit',
    price: number | null,
    limitPrice: number | null,
    executionPrice: number | null,
    amount: number,
    currency: string,
    status: 'pending' | 'executed',
    createdAt?: string
  ): Order {
    return new Order(id, userId, tradeSide, tradeType, price, limitPrice, executionPrice, amount, currency, status, createdAt);
  }
}