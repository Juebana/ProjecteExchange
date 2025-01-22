import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/AuthService/auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({ token: 'test-token' })),
    };
  
    await TestBed.configureTestingModule({
      imports: [FormsModule], 
      declarations: [LoginComponent],
      providers: [
        AuthService
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should show the inputs and the send button', () => {
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

  it('should call AuthService.login with the correct credentials', async () => {
    // Set test data for the form
    component.username = 'testuser';
    component.password = 'password123';

    // Trigger login
    await component.onSubmit();

    // Verify `login` was called with the correct parameters
    const authService = TestBed.inject(AuthService);
    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('should set token on successful login', async () => {
    // Trigger login
    await component.onSubmit();

    // Verify the token was set
    expect(component.token).toEqual('mock-token');
  });
  
});