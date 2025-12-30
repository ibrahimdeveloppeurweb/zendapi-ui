import { TestBed } from '@angular/core/testing';

import { MandateService } from './mandate.service';

describe('MandateService', () => {
  let service: MandateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandateService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
