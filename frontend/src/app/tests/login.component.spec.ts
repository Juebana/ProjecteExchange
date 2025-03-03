import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../components/login/login.component';
import { AuthService } from '../services/AuthService/auth.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { User } from '../models/user.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const mockUser = new User('dummyId', 'testuser', 'testpass', 'test-token');
    authServiceMock.login.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'dashboard', component: DashboardComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the inputs and the send button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const usernameInput = compiled.querySelector('input#username');
    const passwordInput = compiled.querySelector('input#password');
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(submitButton?.textContent).toContain('Log In');
  });

  it('should disable the submit button if username or password is empty', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const usernameInput = compiled.querySelector('input#username') as HTMLInputElement;
    const passwordInput = compiled.querySelector('input#password') as HTMLInputElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(submitButton.disabled).toBeTrue();

    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(submitButton.disabled).toBeTrue();

    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalse();
  });

  it('should call AuthService.login with the correct credentials', () => {
    component.user.username = 'testuser';
    component.user.password = 'testpassword';
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('testuser', 'testpassword');
  });

  it('should set token on successful login', fakeAsync(() => {
    component.user.username = 'testuser';
    component.user.password = 'testpass';
    component.onSubmit();
    tick();
    fixture.detectChanges();
    expect(component.token).toEqual('test-token');
  }));

  it('should redirect to the dashboard after successful login and alert dismissal', () => {
    const routerSpy = spyOn(router, 'navigate');
    authService.login.and.returnValue(of(new User('dummyId', 'testuser', 'password', 'valid-token')));

    component.user.username = 'testuser';
    component.user.password = 'password';
    component.onSubmit();
    fixture.detectChanges();

    component.onAlertDismissed();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/dashboard']);
  });
});