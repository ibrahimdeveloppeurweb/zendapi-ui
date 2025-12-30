import { TestBed } from '@angular/core/testing';

import { FundingInvoiceService } from './funding-invoice.service';

describe('FundingInvoiceService', () => {
  let service: FundingInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundingInvoiceService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
