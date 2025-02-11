import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, NavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the nav-bar component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bar')).toBeTruthy();
  });

  it('should contain placeholders for trading view chart and buy/sell orders', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.trading-view-placeholder')).toBeTruthy();
    expect(compiled.querySelector('.buy-sell-placeholder')).toBeTruthy();
  });
});
