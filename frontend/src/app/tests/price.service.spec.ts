import { TestBed } from '@angular/core/testing';

import { PriceService } from '../services/PriceService/price.service';
import { provideHttpClient } from '@angular/common/http';

describe('PriceService', () => {
  let service: PriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(PriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
