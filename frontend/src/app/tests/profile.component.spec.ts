import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from '../components/profile/profile.component';

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
    expect(component.user.id).toBe('123');
  });
});
