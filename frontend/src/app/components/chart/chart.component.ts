import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => this.initializeChart();
    this.elementRef.nativeElement.appendChild(script);
  }

  private initializeChart(): void {
    new (window as any).TradingView.widget({
      container_id: 'tradingview_chart',
      width: '100%',
      height: '100%',
      symbol: 'BINANCE:PEPEUSDC',
      interval: '1',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_legend: true,
      withdateranges: false
    });
  }
}
