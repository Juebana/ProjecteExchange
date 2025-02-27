import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from '../components/chart/chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a div for the TradingView chart', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.trading-view-container')).toBeTruthy();
  });
});
