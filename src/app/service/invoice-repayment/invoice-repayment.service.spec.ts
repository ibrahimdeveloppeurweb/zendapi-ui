import { TestBed } from '@angular/core/testing';

import { InvoiceRepaymentService } from './invoice-repayment.service';

describe('InvoiceRepaymentService', () => {
  let service: InvoiceRepaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceRepaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
