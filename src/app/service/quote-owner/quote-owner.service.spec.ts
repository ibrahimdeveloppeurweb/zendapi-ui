import { TestBed } from '@angular/core/testing';

import { QuoteOwnerService } from './quote-owner.service';

describe('QuoteOwnerService', () => {
  let service: QuoteOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteOwnerService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
