import { TestBed } from '@angular/core/testing';

import { EntranceInvoiceService } from './entrance-invoice.service';

describe('EntranceInvoiceService', () => {
  let service: EntranceInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntranceInvoiceService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
