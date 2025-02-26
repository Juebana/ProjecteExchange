import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BuySellComponent } from '../components/buysell/buysell.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/OrderService/order.service';
import { PriceService } from '../services/PriceService/price.service';
import { FundService } from '../services/FundService/fund.service'; // Added
import { of } from 'rxjs';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';

describe('BuySellComponent', () => {
  let component: BuySellComponent;
  let fixture: ComponentFixture<BuySellComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let priceServiceSpy: jasmine.SpyObj<PriceService>;
  let fundServiceSpy: jasmine.SpyObj<FundService>; // Spy for FundService

  beforeEach(async () => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['createOrder']);
    orderServiceSpy.createOrder.and.returnValue(of(null));
    priceServiceSpy = jasmine.createSpyObj('PriceService', ['getCurrentPrice']);
    priceServiceSpy.getCurrentPrice.and.returnValue(of(1.23));
    fundServiceSpy = jasmine.createSpyObj('FundService', ['getBalance', 'subtractFunds']); // Spy for FundService

    fundServiceSpy.getBalance.and.returnValue(of({ balance: 0 }));
    fundServiceSpy.subtractFunds.and.returnValue(of({ message: 'Funds subtracted', newBalance: 0 }));

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, BuySellComponent, CustomAlertComponent], // Added CustomAlertComponent
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: PriceService, useValue: priceServiceSpy },
        { provide: FundService, useValue: fundServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuySellComponent);
    component = fixture.componentInstance;
    // Do not call fixture.detectChanges() here yet; we'll control it in each test
  });

  afterEach(() => {
    localStorage.clear(); // Clean up localStorage after each test
  });

  // Existing Test: Component Creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Existing Test: Display HTML Elements
  it('should display all key HTML elements', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const buyRadio = compiled.querySelector('#buyRadio') as HTMLInputElement;
    const sellRadio = compiled.querySelector('#sellRadio') as HTMLInputElement;
    expect(buyRadio).toBeTruthy();
    expect(sellRadio).toBeTruthy();

    const marketRadio = compiled.querySelector('#marketRadio') as HTMLInputElement;
    const limitRadio = compiled.querySelector('#limitRadio') as HTMLInputElement;
    expect(marketRadio).toBeTruthy();
    expect(limitRadio).toBeTruthy();

    const amountInput = compiled.querySelector('#amountInput') as HTMLInputElement;
    expect(amountInput).toBeTruthy();

    const currencySelect = compiled.querySelector('#currencySelect') as HTMLSelectElement;
    expect(currencySelect).toBeTruthy();

    const termsCheckbox = compiled.querySelector('#termsCheckbox') as HTMLInputElement;
    expect(termsCheckbox).toBeTruthy();

    const openTradeBtn = compiled.querySelector('#openTradeBtn') as HTMLButtonElement;
    const resetBtn = compiled.querySelector('#resetBtn') as HTMLButtonElement;
    expect(openTradeBtn).toBeTruthy();
    expect(resetBtn).toBeTruthy();
  });

  // Existing Test: Show Price Input for Limit Orders
  it('should show price input only when Limit is selected', () => {
    fixture.detectChanges();
    let priceInput = fixture.nativeElement.querySelector('#priceInput');
    expect(priceInput).toBeNull();

    component.order.tradeType = 'limit';
    fixture.detectChanges();
    priceInput = fixture.nativeElement.querySelector('#priceInput');
    expect(priceInput).toBeTruthy();

    component.order.tradeType = 'market';
    fixture.detectChanges();
    priceInput = fixture.nativeElement.querySelector('#priceInput');
    expect(priceInput).toBeNull();
  });

  // Existing Test: Update Button Text
  it('should update the button text based on tradeSide (Buy/Sell)', () => {
    fixture.detectChanges();
    const openTradeBtn = fixture.nativeElement.querySelector('#openTradeBtn') as HTMLButtonElement;

    expect(openTradeBtn.textContent).toContain('Open Buy');

    component.order.tradeSide = 'sell';
    fixture.detectChanges();
    expect(openTradeBtn.textContent).toContain('Open Sell');

    component.order.tradeSide = 'buy';
    fixture.detectChanges();
    expect(openTradeBtn.textContent).toContain('Open Buy');
  });

  // Existing Test: Terms Not Accepted
  it('should not allow trade if terms are not accepted', async () => {
    component.acceptedTerms = false;
    await component.openTrade();
    expect(orderServiceSpy.createOrder).not.toHaveBeenCalled();
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Please accept the terms and conditions.');
  });

  // Existing Test: Fetch Market Price for Market Orders
  it('should fetch market price for market orders', async () => {
    const mockUser = { id: '123', username: 'testuser', password: 'password' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    fundServiceSpy.getBalance.and.returnValue(of({ balance: 1000 }));
    component.order.tradeType = 'market';
    component.order.amount = 100; // Valid amount within balance
    component.acceptedTerms = true;

    fixture.detectChanges();
    await component.openTrade();

    expect(priceServiceSpy.getCurrentPrice).toHaveBeenCalledWith('BTCUSDC');
    expect(orderServiceSpy.createOrder).toHaveBeenCalled();
  });

  // Existing Test: No Market Price for Limit Orders
  it('should not fetch market price for limit orders', async () => {
    const mockUser = { id: '123', username: 'testuser', password: 'password' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    fundServiceSpy.getBalance.and.returnValue(of({ balance: 1000 }));
    component.order.tradeType = 'limit';
    component.order.price = 1000;
    component.order.amount = 100; // Valid amount within balance
    component.acceptedTerms = true;

    fixture.detectChanges();
    await component.openTrade();

    expect(priceServiceSpy.getCurrentPrice).not.toHaveBeenCalled();
    expect(orderServiceSpy.createOrder).toHaveBeenCalled();
  });

  // New Test: Fetch Balance on Initialization
  it('should fetch user balance on initialization', () => {
    const mockUser = { _id: '123', _username: 'testuser', _password: 'password', _token: 'testtoken' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    fundServiceSpy.getBalance.and.returnValue(of({ balance: 1000 }));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(fundServiceSpy.getBalance).toHaveBeenCalledWith('123');
    expect(component.fund.balance).toBe(1000);

    const balanceElement = fixture.nativeElement.querySelector('.balance-section h3');
    expect(balanceElement.textContent).toContain('Your Balance: $1,000.00');
  });

  // New Test: Prevent Order Placement with Insufficient Balance
  it('should prevent order placement if balance is insufficient', async () => {
    const mockUser = { id: '123', username: 'testuser', password: 'password' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    fundServiceSpy.getBalance.and.returnValue(of({ balance: 100 }));
    component.order.amount = 200; // Amount exceeds balance
    component.order.tradeType = 'market';
    component.acceptedTerms = true;

    fixture.detectChanges(); // Trigger ngOnInit
    await component.openTrade();

    expect(orderServiceSpy.createOrder).not.toHaveBeenCalled();
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Insufficient balance to place this order.');
  });

  // New Test: Subtract Funds After Successful Order
  it('should subtract funds after successful order placement', fakeAsync(() => {
    // Set up mock user with correct structure
    const mockUser = { _id: '123', _username: 'testuser', _password: 'password', _token: 'testtoken' };
    localStorage.setItem('user', JSON.stringify(mockUser));
  
    // Configure spies
    fundServiceSpy.getBalance.and.returnValue(of({ balance: 1000 }));
    fundServiceSpy.subtractFunds.and.returnValue(of({ message: 'Funds subtracted', newBalance: 800 }));
    orderServiceSpy.createOrder.and.returnValue(of(null));
  
    // Set component properties
    component.order.amount = 200;
    component.order.tradeType = 'market';
    component.acceptedTerms = true;
  
    fixture.detectChanges(); // Trigger ngOnInit
    component.openTrade();   // Call openTrade (no await needed with fakeAsync)
    tick();                  // Simulate async completion
  
    // Assertions
    expect(orderServiceSpy.createOrder).toHaveBeenCalled();
    expect(fundServiceSpy.subtractFunds).toHaveBeenCalledWith('123', 200);
    expect(component.fund.balance).toBe(800);
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Order successfully placed!');
  
    fixture.detectChanges();
    const balanceElement = fixture.nativeElement.querySelector('.balance-section h3');
    expect(balanceElement.textContent).toContain('Your Balance: $800.00');
  }));
});