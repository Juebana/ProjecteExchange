import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule]
})
export class CustomAlertComponent {
  @Input() showAlert: boolean = false;
  @Input() alertMessage: string = '';
  @Output() dismissed = new EventEmitter<void>();

  dismiss() {
    this.dismissed.emit();
  }
}