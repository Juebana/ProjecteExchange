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
        provideRouter([
          { path: 'login', component: LoginComponent }
        ]),
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

  it('should disable the register button if username or password is empty', () => {
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

  it('should call AuthService.register with the correct credentials', () => {
    component.user.username = 'testuser';
    component.user.password = 'testpassword';
    component.onSubmit();
    expect(authService.register).toHaveBeenCalledWith('testuser', 'testpassword');
  });

  it('should redirect to login after successful registration', () => {
    const routerSpy = spyOn(router, 'navigate');
    component.user.username = 'testuser';
    component.user.password = 'password';
    component.onSubmit();
    component.onAlertDismissed();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should update user object when inputs change', () => {
    const usernameInput = fixture.nativeElement.querySelector('input#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('input#password') as HTMLInputElement;

    usernameInput.value = 'newuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'newpassword';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.user.username).toBe('newuser');
    expect(component.user.password).toBe('newpassword');
  });

  it('should show alert on registration failure', fakeAsync(() => {
    authService.register.and.returnValue(throwError(() => new Error('Registration failed')));
    component.user.username = 'testuser';
    component.user.password = 'testpassword';
    component.onSubmit();
    tick();
    fixture.detectChanges();
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Registration failed. Please try again.');
  }));

  it('should show alert when form is invalid', () => {
    component.user.username = '';
    component.user.password = '';
    component.onSubmit();
    fixture.detectChanges();
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Please fill in both username and password.');
  });
});