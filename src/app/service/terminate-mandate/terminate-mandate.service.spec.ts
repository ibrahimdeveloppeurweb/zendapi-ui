import { TestBed } from '@angular/core/testing';

import { TerminateMandateService } from './terminate-mandate.service';

describe('TerminateMandateService', () => {
  let service: TerminateMandateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminateMandateService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
