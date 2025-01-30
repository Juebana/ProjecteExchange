import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/AuthService/auth.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    authServiceMock.login.and.returnValue(of({ token: 'test-token' }));

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock, login: () => of({ token: 'test-token' }) }, 
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
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
    component.username = 'testuser';
    component.password = 'testpassword';

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'testpassword');
  });

  it('should set token on successful login', async () => {
    component.username = 'testuser';
    component.password = 'testpassword';
  
    component.onSubmit();
    fixture.detectChanges(); 
    
    expect(component.token).toEqual('test-token'); 
  });
  
  it('should display a toggle switch and allow switching between Login and Register', () => {
    const toggleSwitch = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(component.isRegistration).toBeFalse();

    toggleSwitch.checked = true;
    toggleSwitch.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.isRegistration).toBeTrue();
  });
  
});
