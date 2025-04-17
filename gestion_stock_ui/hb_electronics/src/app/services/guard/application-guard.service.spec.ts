import { TestBed } from '@angular/core/testing';

import { ApplicationGuardService } from './application-guard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApplicationGuardService', () => {
  let service: ApplicationGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule] });
    service = TestBed.inject(ApplicationGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
