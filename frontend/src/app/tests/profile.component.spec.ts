import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from '../components/profile/profile.component';
import { FundService } from '../services/FundService/fund.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { User } from '../models/user.model';


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockUser = new User('123', 'Test User', 'Test Password', 'test-token');


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent], 
      providers: [FundService, provideHttpClient(), provideRouter([{ path: 'dashboard', component: DashboardComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear(); // Clean up localStorage after each test
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should retrieve user from local storage', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    fixture.detectChanges();
    expect(component.user).toBeDefined();
    expect(component.user?.id).toBe('123'); // Now matches the mockUser's id
  });

  it('should fetch balance if user is present', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    const fundService = TestBed.inject(FundService);
    spyOn(fundService, 'getBalance').and.returnValue(of({ balance: 100 }));
    fixture.detectChanges();
    expect(fundService.getBalance).toHaveBeenCalledWith('123');
    expect(component.fund.balance).toBe(100);
  });

  it('should recharge funds correctly', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    fixture.detectChanges();
    component.rechargeAmount = 50;
    const fundService = TestBed.inject(FundService);
    spyOn(fundService, 'rechargeFunds').and.returnValue(of({ message: 'Success', newBalance: 150 }));
    const mockForm = { valid: true, resetForm: jasmine.createSpy('resetForm') } as any;
    component.onRecharge(mockForm);
    expect(fundService.rechargeFunds).toHaveBeenCalledWith('123', 50);
    expect(component.fund.balance).toBe(150);
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Success');
    expect(mockForm.resetForm).toHaveBeenCalled();
  });
  
  it('should dismiss alert', () => {
    component.showAlert = true;
    component.onAlertDismissed();
    expect(component.showAlert).toBeFalse();
  });

  it('should have a back to dashboard button', () => {
    fixture.detectChanges();
    const backButton = fixture.nativeElement.querySelector('button[routerLink="/dashboard"]');
    expect(backButton).toBeTruthy();
    expect(backButton.textContent.trim()).toBe('Back to Dashboard');
  });
});