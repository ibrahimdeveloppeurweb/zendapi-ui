import { TestBed } from '@angular/core/testing';

import { PaymentRepaymentService } from './payment-repayment.service';

describe('PaymentRepaymentService', () => {
  let service: PaymentRepaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentRepaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
