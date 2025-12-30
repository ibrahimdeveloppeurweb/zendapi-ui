import { TestBed } from '@angular/core/testing';

import { OwnerCoService } from './owner-co.service';

describe('OwnerCoService', () => {
  let service: OwnerCoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerCoService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
