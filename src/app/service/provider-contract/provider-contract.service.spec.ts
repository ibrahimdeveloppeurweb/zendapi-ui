import { TestBed } from '@angular/core/testing';

import { ProviderContractService } from './provider-contract.service';

describe('ProviderContractService', () => {
  let service: ProviderContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
