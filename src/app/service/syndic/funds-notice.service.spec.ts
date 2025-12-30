import { TestBed } from '@angular/core/testing';

import { FundsNoticeService } from './funds-notice.service';

describe('FundsNoticeService', () => {
  let service: FundsNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundsNoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
