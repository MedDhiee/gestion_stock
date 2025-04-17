import { TestBed } from '@angular/core/testing';

import { CommandeService } from './commande.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CommandeService', () => {
  let service: CommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(CommandeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
