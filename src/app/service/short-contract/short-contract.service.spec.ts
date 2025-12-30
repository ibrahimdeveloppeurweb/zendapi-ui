import { TestBed } from '@angular/core/testing';

import { ShortContractService } from './short-contract.service';

describe('ShortContractService', () => {
  let service: ShortContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
