import { TestBed } from '@angular/core/testing';

import { SpentService } from './spent.service';

describe('SpentService', () => {
  let service: SpentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpentService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
