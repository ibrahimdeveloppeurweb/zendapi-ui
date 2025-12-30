import { TestBed } from '@angular/core/testing';

import { RenewPaymentService } from './renew-payment.service';

describe('RenewPaymentService', () => {
  let service: RenewPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenewPaymentService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
