import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ChartComponent } from "../chart/chart.component";
import { BuySellComponent } from '../buysell/buysell.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavBarComponent, ChartComponent, BuySellComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
