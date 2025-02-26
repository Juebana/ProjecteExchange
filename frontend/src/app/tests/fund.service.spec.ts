import { TestBed } from '@angular/core/testing';

import { FundService } from '../services/FundService/fund.service';
import { provideHttpClient } from '@angular/common/http';

describe('FundService', () => {
  let service: FundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(FundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
