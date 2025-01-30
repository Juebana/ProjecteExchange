import { ComponentFixture, TestBed } from '@angular/core/testing';

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
  
    const compiled = fixture.nativeElement as HTMLElement;
    const logoutButton = compiled.querySelector('button.logout-btn')!;
    logoutButton.click();
  
    expect(component.logout).toHaveBeenCalled();
  });
});
