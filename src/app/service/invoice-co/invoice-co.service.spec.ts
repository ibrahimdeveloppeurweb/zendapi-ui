import { TestBed } from '@angular/core/testing';

import { InvoiceCoService } from './invoice-co.service';

describe('InvoiceCoService', () => {
  let service: InvoiceCoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceCoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
