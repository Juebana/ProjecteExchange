import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from '../components/register/register.component';
import { AuthService } from '../services/AuthService/auth.service';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from '../components/login/login.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['register']);
    authServiceMock.register.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [FormsModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', component: LoginComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the inputs and the register button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input#username')).toBeTruthy();
    expect(compiled.querySelector('input#password')).toBeTruthy();
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton?.textContent).toContain('Register');
  });

  it('should disable the register button if username or password is empty', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const usernameInput = compiled.querySelector('input#username') as HTMLInputElement;
    const passwordInput = compiled.querySelector('input#password') as HTMLInputElement;
    const confirmPasswordInput = compiled.querySelector('input#confirmPassword') as HTMLInputElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
  
    // Wait for form initialization to complete
    await fixture.whenStable();
    fixture.detectChanges();
  
    // Initial state with empty fields
    expect(submitButton.disabled).toBeTrue();
  
    // Fill in username only
    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTrue(); // Password and confirm password still empty
  
    // Fill in password and confirm password
    passwordInput.value = 'Test1234';
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.value = 'Test1234';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  
    // All fields valid, button should be enabled
    expect(submitButton.disabled).toBeFalse();
  });

  it('should call AuthService.register with the correct credentials', () => {
    const usernameInput = fixture.nativeElement.querySelector('input#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('input#password') as HTMLInputElement;
    const confirmPasswordInput = fixture.nativeElement.querySelector('input#confirmPassword') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form');

    usernameInput.value = 'testuser';
    passwordInput.value = 'Test1234'; // Meets pattern: >=8 chars, upper, lower, number
    confirmPasswordInput.value = 'Test1234';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith('testuser', 'Test1234');
  });

  it('should redirect to login after successful registration', fakeAsync(() => {
    const routerSpy = spyOn(router, 'navigate');
    const usernameInput = fixture.nativeElement.querySelector('input#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('input#password') as HTMLInputElement;
    const confirmPasswordInput = fixture.nativeElement.querySelector('input#confirmPassword') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form');

    usernameInput.value = 'testuser';
    passwordInput.value = 'Test1234';
    confirmPasswordInput.value = 'Test1234';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    tick(); // Handle the observable subscription
    fixture.detectChanges();

    component.onAlertDismissed(); // Simulate dismissing the success alert
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('should update user object when inputs change', () => {
    const usernameInput = fixture.nativeElement.querySelector('input#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('input#password') as HTMLInputElement;

    usernameInput.value = 'newuser';
    passwordInput.value = 'Newpass123';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.user.username).toBe('newuser');
    expect(component.user.password).toBe('Newpass123');
  });

  it('should show alert on registration failure', fakeAsync(() => {
    authService.register.and.returnValue(throwError(() => new Error('Registration failed')));
    const usernameInput = fixture.nativeElement.querySelector('input#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('input#password') as HTMLInputElement;
    const confirmPasswordInput = fixture.nativeElement.querySelector('input#confirmPassword') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form');

    usernameInput.value = 'testuser';
    passwordInput.value = 'Test1234';
    confirmPasswordInput.value = 'Test1234';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Registration failed. Please try again.');
  }));

  it('should show alert when form is invalid', () => {
    const usernameInput = fixture.nativeElement.querySelector('input#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('input#password') as HTMLInputElement;
    const confirmPasswordInput = fixture.nativeElement.querySelector('input#confirmPassword') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form');

    usernameInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe(
      'Please fix the following: Username is required. Password must be at least 8 characters, with an uppercase letter, lowercase letter, and number.'
    );
  });
});