import { TestBed } from '@angular/core/testing';

import { walletService } from './wallet.service';

describe('OwnerService', () => {
  let service: walletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(walletService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
