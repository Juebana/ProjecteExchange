import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavBarComponent } from './nav-bar.component';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logout button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoutButton = compiled.querySelector('button.logout-btn');
    expect(logoutButton).toBeTruthy();
  });

  it('should call logout() when logout button is clicked', () => {
    spyOn(component, 'logout'); 
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const logoutButton = compiled.querySelector('button.logout-btn') as HTMLElement;
    logoutButton?.click();
  
    expect(component.logout).toHaveBeenCalled();
  });

  it('should call goToProfile() when profile button is clicked', () => {
    spyOn(component, 'goToProfile'); 
  
    fixture.detectChanges(); 
  
    const compiled = fixture.nativeElement as HTMLElement;
    const profileButton = compiled.querySelector('button.profile-btn') as HTMLElement;
  
    expect(profileButton).toBeTruthy();
  
    profileButton?.click(); 
  
    expect(component.goToProfile).toHaveBeenCalled(); 
  });

  it('should navigate to "/profile" when goToProfile() is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  
    component.goToProfile(); 
  
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should display the logged-in username', () => {
    localStorage.setItem('username', 'TestUser');
    component.ngOnInit();
    fixture.detectChanges();
  
    const usernameElement = fixture.nativeElement.querySelector('.username');
    expect(usernameElement.textContent).toContain('TestUser');
  
    localStorage.removeItem('username');
  });
});
