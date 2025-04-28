import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AuthenticationService } from '../../../gs-api/src/services/authentication-controller.service';
import { UtilisateursService } from '../../../gs-api/src/services/utilisateur-controller.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationResponse } from '../../../gs-api/src/models/authentication-response';
import { UtilisateurDto } from '../../../gs-api/src/models/utilisateur-dto';
import { HttpClientTestingModule } from '@angular/common/http/testing';
const FAKE_EMAIL = 'test@example.com';
const FAKE_PASSWORD = 'fakePassword123'; 
describe('UserService', () => {
  let userService: UserService;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let utilisateursServiceSpy: jasmine.SpyObj<UtilisateursService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Créer des spies pour les services injectés
    authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['authenticate']);
    utilisateursServiceSpy = jasmine.createSpyObj('UtilisateursService', ['findByEmail']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: UtilisateursService, useValue: utilisateursServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  describe('login', () => {
    it('should call authenticate and return an AuthenticationResponse', () => {
      const authRequest = { email: FAKE_EMAIL, password: FAKE_PASSWORD};
      const mockAuthResponse: AuthenticationResponse = { accessToken: 'mockToken' }; // Replace 'token' with the correct property name

      authenticationServiceSpy.authenticate.and.returnValue(of(mockAuthResponse));

      userService.login(authRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });
      expect(authenticationServiceSpy.authenticate).toHaveBeenCalledWith(authRequest);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user details by email', () => {
      const mockUser: UtilisateurDto = { id: 1, email: 'test@example.com' };
      utilisateursServiceSpy.findByEmail.and.returnValue(of(mockUser));

      userService.getUserByEmail('test@example.com').subscribe(user => {
        expect(user).toEqual(mockUser);
      });
      expect(utilisateursServiceSpy.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return empty observable when email is not provided', () => {
      userService.getUserByEmail().subscribe(user => {
        expect(user).toEqual({});
      });
      expect(utilisateursServiceSpy.findByEmail).not.toHaveBeenCalled();
    });
  });

  describe('setConnectedUser', () => {
    it('should store connected user in localStorage', () => {
      const mockUser: UtilisateurDto = { id: 1, email: 'test@example.com' };
      const spySetItem = spyOn(localStorage, 'setItem');
      
      userService.setConnectedUser(mockUser);
      
      expect(spySetItem).toHaveBeenCalledWith('connectedUser', JSON.stringify(mockUser));
    });
  });

  describe('getConnectedUser', () => {
    it('should get connected user from localStorage', () => {
      const mockUser: UtilisateurDto = { id: 1, email: 'test@example.com' };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
      
      const user = userService.getConnectedUser();
      expect(user).toEqual(mockUser);
    });

    it('should return empty object if no connected user', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      
      const user = userService.getConnectedUser();
      expect(user).toEqual({});
    });
  });

  describe('logout', () => {
    it('should remove token and user from localStorage and redirect to login', () => {
      const spyRemoveItem = spyOn(localStorage, 'removeItem');
      
      userService.logout();
      
      expect(spyRemoveItem).toHaveBeenCalledWith('accessToken');
      expect(spyRemoveItem).toHaveBeenCalledWith('connectedUser');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);

    });
  });

  describe('isLoggedIn', () => {
    it('should return true if token is valid', () => {
      const mockToken = 'validToken';
      const mockPayload = { exp: Math.floor(Date.now() / 1000) + 60 }; // Token expires in 1 minute
      spyOn(localStorage, 'getItem').and.returnValue(mockToken);
      spyOn(userService, 'decodeToken').and.returnValue(mockPayload);
      
      const result = userService.isLoggedIn();
      
      expect(result).toBeTrue();
    });

    it('should return false if token is expired', () => {
      const mockToken = 'expiredToken';
      const mockPayload = { exp: Math.floor(Date.now() / 1000) - 60 }; // Token expired 1 minute ago
      spyOn(localStorage, 'getItem').and.returnValue(mockToken);
      spyOn(userService, 'decodeToken').and.returnValue(mockPayload);
      
      const result = userService.isLoggedIn();
      
      expect(result).toBeFalse();
    });

    it('should return false if no token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      
      const result = userService.isLoggedIn();
      
      expect(result).toBeFalse();
    });
  });

});

