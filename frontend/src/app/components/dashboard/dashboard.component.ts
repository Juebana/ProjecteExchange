import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ChartComponent } from "../chart/chart.component";
import { BuySellComponent } from '../buysell/buysell.component';
import { OrderListComponent } from '../order-list/order-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavBarComponent, ChartComponent, BuySellComponent, OrderListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
