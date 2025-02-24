import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';

describe('CustomAlertComponent', () => {
  let component: CustomAlertComponent;
  let fixture: ComponentFixture<CustomAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAlertComponent] // For standalone components
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the alert when showAlert is false', () => {
    component.showAlert = false;
    fixture.detectChanges();
    const alertElement = fixture.nativeElement.querySelector('.custom-alert');
    expect(alertElement).toBeNull();
  });

  it('should show the alert with the correct message when showAlert is true', () => {
    component.showAlert = true;
    component.alertMessage = 'Test message';
    fixture.detectChanges();
    const alertElement = fixture.nativeElement.querySelector('.custom-alert');
    const messageElement = fixture.nativeElement.querySelector('.alert-message');
    expect(alertElement).not.toBeNull();
    expect(messageElement.textContent).toBe('Test message');
  });

  it('should emit dismissed event when dismiss is called', () => {
    spyOn(component.dismissed, 'emit');
    component.dismiss();
    expect(component.dismissed.emit).toHaveBeenCalled();
  });
});