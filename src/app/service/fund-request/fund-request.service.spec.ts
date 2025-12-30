import { TestBed } from '@angular/core/testing';

import { FundRequestService } from './fund-request.service';

describe('FundRequestService', () => {
  let service: FundRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundRequestService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
