import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySellComponent } from './buysell.component';

describe('BuysellComponenS', () => {
  let component: BuySellComponent;
  let fixture: ComponentFixture<BuySellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuySellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuySellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Buy and Sell toggles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buyRadio = compiled.querySelector('#buyRadio') as HTMLInputElement;
    const sellRadio = compiled.querySelector('#sellRadio') as HTMLInputElement;
    expect(buyRadio).toBeTruthy();
    expect(sellRadio).toBeTruthy();
  });
   
  it('should display Market and Limit toggles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const marketRadio = compiled.querySelector('#marketRadio') as HTMLInputElement;
    const limitRadio = compiled.querySelector('#limitRadio') as HTMLInputElement;
    expect(marketRadio).toBeTruthy();
    expect(limitRadio).toBeTruthy();
  });

  it('should show price input only if Limit is selected', () => {
    let priceInput = fixture.nativeElement.querySelector('#priceInput');
    expect(priceInput).toBeNull();
  
    component.isLimit = true;
    fixture.detectChanges();
  
    priceInput = fixture.nativeElement.querySelector('#priceInput');
    expect(priceInput).toBeTruthy();
  });
  
  it('should always display amount input', () => {
    const amountInput = fixture.nativeElement.querySelector('#amountInput') as HTMLInputElement;
    expect(amountInput).toBeTruthy();
  });

  it('should display a button with correct text (Open Buy / Open Sell)', () => {
    const openButton = fixture.nativeElement.querySelector('#openTradeBtn') as HTMLButtonElement;
    expect(openButton).toBeTruthy();

    expect(openButton.textContent).toContain('Open Buy');

    component.isBuy = false;
    fixture.detectChanges();
    expect(openButton.textContent).toContain('Open Sell');
  });
  
});
