import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpInterceptorService } from './http-interceptor.service';
import { LoaderService } from '../../composants/loader/service/loader.service';

describe('HttpInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LoaderService, useValue: loaderSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptorService,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    loaderServiceSpy = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add Authorization header if accessToken exists', () => {
    const fakeToken = 'fake-jwt-token';
    localStorage.setItem('accessToken', JSON.stringify({ accessToken: fakeToken }));

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    req.flush({}); // Mock a successful response

    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it('should not add Authorization header if no accessToken', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({}); // Mock a successful response

    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it('should call hide on error response', () => {
    localStorage.setItem('accessToken', JSON.stringify({ accessToken: 'fake-token' }));

    httpClient.get('/test').subscribe({
      error: () => {
        expect(loaderServiceSpy.hide).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('error occurred', { status: 500, statusText: 'Server Error' });
  });
});
