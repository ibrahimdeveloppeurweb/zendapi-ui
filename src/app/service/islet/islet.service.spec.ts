import { TestBed } from '@angular/core/testing';

import { IsletService } from './islet.service';

describe('IsletService', () => {
  let service: IsletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsletService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
