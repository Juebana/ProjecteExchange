import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuySellComponent } from '../components/buysell/buysell.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/OrderService/order.service';
import { PriceService } from '../services/PriceService/price.service';
import { of } from 'rxjs';

describe('BuySellComponent', () => {
  let component: BuySellComponent;
  let fixture: ComponentFixture<BuySellComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let priceServiceSpy: jasmine.SpyObj<PriceService>;

  beforeEach(async () => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['createOrder']);
    orderServiceSpy.createOrder.and.returnValue(of(null));
    priceServiceSpy = jasmine.createSpyObj('PriceService', ['getCurrentPrice']);
    priceServiceSpy.getCurrentPrice.and.returnValue(of(1.23));

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, BuySellComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: PriceService, useValue: priceServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuySellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display all key HTML elements', () => {
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

  it('should show price input only when Limit is selected', () => {
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

  it('should update the button text based on tradeSide (Buy/Sell)', () => {
    const openTradeBtn = fixture.nativeElement.querySelector('#openTradeBtn') as HTMLButtonElement;

    expect(openTradeBtn.textContent).toContain('Open Buy');

    component.order.tradeSide = 'sell';
    fixture.detectChanges();
    expect(openTradeBtn.textContent).toContain('Open Sell');

    component.order.tradeSide = 'buy';
    fixture.detectChanges();
    expect(openTradeBtn.textContent).toContain('Open Buy');
  });

  it('should not allow trade if terms are not accepted', async () => {
    component.acceptedTerms = false;
    await component.openTrade();
    expect(orderServiceSpy.createOrder).not.toHaveBeenCalled();
  });

  it('should fetch market price for market orders', async () => {
    component.order.tradeType = 'market';
    component.acceptedTerms = true;
    localStorage.setItem('user', JSON.stringify({ id: '123' }));

    await component.openTrade();
    expect(priceServiceSpy.getCurrentPrice).toHaveBeenCalledWith('BTCUSDC');
    expect(orderServiceSpy.createOrder).toHaveBeenCalled();
  });

  it('should not fetch market price for limit orders', async () => {
    component.order.tradeType = 'limit';
    component.order.price = 1000;
    component.acceptedTerms = true;
    localStorage.setItem('user', JSON.stringify({ id: '123' }));

    await component.openTrade();
    expect(priceServiceSpy.getCurrentPrice).not.toHaveBeenCalled();
    expect(orderServiceSpy.createOrder).toHaveBeenCalled();
  });
});