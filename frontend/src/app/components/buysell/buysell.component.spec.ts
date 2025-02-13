import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuysellComponent } from './buysell.component';

describe('BuysellComponent', () => {
  let component: BuysellComponent;
  let fixture: ComponentFixture<BuysellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuysellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuysellComponent);
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
  
});
