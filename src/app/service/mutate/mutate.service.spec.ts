import { TestBed } from '@angular/core/testing';

import { MutateService } from './mutate.service';

describe('MutateService', () => {
  let service: MutateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MutateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
