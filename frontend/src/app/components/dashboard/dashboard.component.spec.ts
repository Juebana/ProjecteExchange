import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ChartComponent } from '../chart/chart.component';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, NavBarComponent, ChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the NavBarComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bar')).toBeTruthy();
  });

  it('should contain the ChartComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-chart')).toBeTruthy();
  });

  it('should contain a placeholder for buy/sell orders', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.buy-sell-placeholder')).toBeTruthy();
  });

  it('should contain the BuySellComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-buysell')).toBeTruthy();
  });
});
