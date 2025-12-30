import { TestBed } from '@angular/core/testing';

import { TerminateService } from './terminate.service';

describe('TerminateService', () => {
  let service: TerminateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminateService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
