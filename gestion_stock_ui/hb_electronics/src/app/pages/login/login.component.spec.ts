import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'logout',
      'login',
      'setAccessToken',
      'getUserByEmail',
      'setConnectedUser'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout on init', () => {
    component.ngOnInit();
    expect(mockUserService.logout).toHaveBeenCalled();
  });

  const FAKE_LOGIN = 'test';
  const FAKE_PASSWORD = 'fakePassword123'; // nom générique, non sensible

  it('should login successfully and navigate', () => {
  const fakeResponse = { accessToken: 'fake-jwt-token' };
  const fakeUser = { id: 1, email: 'test@example.com' };

  component.authenticationRequest = {
    login: FAKE_LOGIN,
    password: FAKE_PASSWORD
  };
    mockUserService.login.and.returnValue(of(fakeResponse));
    mockUserService.getUserByEmail.and.returnValue(of(fakeUser));
  
    component.login();
  
    expect(mockUserService.login).toHaveBeenCalledWith(component.authenticationRequest);
    expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('test');
    expect(mockUserService.setConnectedUser).toHaveBeenCalledWith(fakeUser);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/statistiques']);
  });
  

  it('should handle login failure', () => {
    const error = { status: 401 };
    component.authenticationRequest = { login: FAKE_LOGIN,
      password: FAKE_PASSWORD };
    mockUserService.login.and.returnValue(throwError(() => error));

    component.login();

    expect(component.errorMessage).toBe('Login et / ou mot de passe incorrecte');
  });
});
