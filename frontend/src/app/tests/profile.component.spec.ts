import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from '../components/profile/profile.component';
import { FundService } from '../services/FundService/fund.service';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve user from local storage', () => {
    const mockUser = { id: '123', name: 'Test User' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.user).toBeDefined();
    expect(component.user?.id).toBe('123');
  });

  it('should fetch balance if user is present', () => {
    const mockUser = { id: '123', name: 'Test User' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    const fundService = TestBed.inject(FundService);
    spyOn(fundService, 'getBalance').and.returnValue(of({ balance: 100 }));
    component.ngOnInit();
    expect(fundService.getBalance).toHaveBeenCalledWith('123');
    expect(component.fund.balance).toBe(100);
  });
});
