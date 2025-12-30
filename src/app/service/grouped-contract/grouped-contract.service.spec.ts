import { TestBed } from '@angular/core/testing';

import { GroupedContractService } from './grouped-contract.service';

describe('GroupedContractService', () => {
  let service: GroupedContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupedContractService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
