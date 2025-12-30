import { TestBed } from '@angular/core/testing';

import { InvoiceFolderService } from './invoice-folder.service';

describe('InvoiceFolderService', () => {
  let service: InvoiceFolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceFolderService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
