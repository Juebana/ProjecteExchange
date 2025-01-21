import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
    })
    .compileComponents();

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
    expect(submitButton?.textContent?.toLowerCase()).toContain('inicia sessió');
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

  it('should call the login method with username and password when the form is submitted', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const usernameInput = compiled.querySelector('input#username') as HTMLInputElement;
    const passwordInput = compiled.querySelector('input#password') as HTMLInputElement;
    const form = compiled.querySelector('form') as HTMLFormElement;
  
    spyOn(component, 'login');

    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.login).toHaveBeenCalledWith('testuser', 'password123');
  });
  
});
