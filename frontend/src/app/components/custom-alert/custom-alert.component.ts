import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
  standalone: true 
})
export class CustomAlertComponent {
  @Input() showAlert: boolean = false;
  @Input() alertMessage: string = '';
  @Output() dismissed = new EventEmitter<void>();

  dismiss() {
    this.dismissed.emit();
  }
}