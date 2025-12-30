import { TestBed } from '@angular/core/testing';

import { ExtendContractService } from './extend-contract.service';

describe('ExtendContractService', () => {
  let service: ExtendContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtendContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
