import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationGuardService } from './application-guard.service';
import { UserService } from '../user/user.service';
import { TokenDecoderService } from '../token-decoder.service';

describe('ApplicationGuardService', () => {
  let service: ApplicationGuardService;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let tokenDecoderSpy: jasmine.SpyObj<TokenDecoderService>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const userServiceMock = jasmine.createSpyObj('UserService', ['isLoggedIn']);
    const decoderMock = jasmine.createSpyObj('TokenDecoderService', ['decodeToken']);

    TestBed.configureTestingModule({
      providers: [
        ApplicationGuardService,
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: TokenDecoderService, useValue: decoderMock }
      ]
    });

    service = TestBed.inject(ApplicationGuardService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    tokenDecoderSpy = TestBed.inject(TokenDecoderService) as jasmine.SpyObj<TokenDecoderService>;
    route = {} as ActivatedRouteSnapshot;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return false and navigate to "" if no token is found', () => {
    localStorage.removeItem('accessToken');
    const result = service.canActivate(route);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });

  it('should return false and navigate to "" if token is invalid', () => {
    localStorage.setItem('accessToken', 'invalid.token');
    tokenDecoderSpy.decodeToken.and.throwError('Invalid token');

    const result = service.canActivate(route);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });

  it('should return true if token is valid and user is logged in', () => {
    localStorage.setItem('accessToken', 'valid.token');
    tokenDecoderSpy.decodeToken.and.returnValue({ sub: '123' });
    userServiceSpy.isLoggedIn.and.returnValue(true);

    const result = service.canActivate(route);
    expect(result).toBeTrue();
  });

  it('should return false and navigate to /unauthorized if user is not logged in', () => {
    localStorage.setItem('accessToken', 'valid.token');
    tokenDecoderSpy.decodeToken.and.returnValue({ sub: '123' });
    userServiceSpy.isLoggedIn.and.returnValue(false);

    const result = service.canActivate(route);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
