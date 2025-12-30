import { TestBed } from '@angular/core/testing';

import { PaymentFundingService } from './payment-funding.service';

describe('PaymentFundingService', () => {
  let service: PaymentFundingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentFundingService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
