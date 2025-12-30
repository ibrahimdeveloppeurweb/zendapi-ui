import { TestBed } from '@angular/core/testing';

import { InvoiceOwnerService } from './invoice-owner.service';

describe('InvoiceOwnerService', () => {
  let service: InvoiceOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceOwnerService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
