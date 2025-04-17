import { TestBed } from '@angular/core/testing';

import { LoginGuardService } from './login-guard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginGuardService', () => {
  let service: LoginGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(LoginGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
