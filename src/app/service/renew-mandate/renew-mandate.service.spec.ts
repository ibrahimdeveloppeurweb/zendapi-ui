import { TestBed } from '@angular/core/testing';

import { RenewMandateService } from './renew.service';

describe('RenewMandateService', () => {
  let service: RenewMandateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenewMandateService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
