import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { NavComponent } from './nav.component';
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  // Mock the AuthService by spying on AuthService using jasmine.
  // We spy on the createUser and logout function of the AuthService
  // to see if they are correctly called. With this, the mocked AuthService
  // will not rely on Firebase.
  const mockedAuthService = jasmine.createSpyObj(
    'AuthService',
    [
      'createUser',
      'logout'
    ],
    {
      // Force the user login status to be always authenticated
      isAuthenticated: true
    }
  )

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      // The component relies on routing to be functional,
      // We import Angular's RouterTestingModule to provide
      // basic routing for the component in testing.
      imports: [ RouterTestingModule ],
      providers: [
        // Override the original AuthService dependency to our mockedAuthService:
        { provide: AuthService, useValue: mockedAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    // Query the logout link, Logout Link is the 3rd link in the nav bar:
    const logoutLink = fixture.debugElement.query(By.css('li:nth-child(3) a'));

    // Verify the logout link exists:
    expect(logoutLink)
    .withContext('Not logged in')
    .toBeTruthy();

    // Simulate click logout event:
    logoutLink.triggerEventHandler('click');

    // Retrieve AuthService injected to the testing module:
    const service = TestBed.inject(AuthService);

    // Verify that the logout function was called:
    expect(service.logout)
    .withContext('Could not click logout link')
    .toHaveBeenCalledTimes(1);
  });
});
