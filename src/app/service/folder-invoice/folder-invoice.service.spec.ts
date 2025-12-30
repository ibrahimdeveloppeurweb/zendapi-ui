import { TestBed } from '@angular/core/testing';

import { FolderInvoiceService } from './folder-invoice.service';

describe('FolderInvoiceService', () => {
  let service: FolderInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FolderInvoiceService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
