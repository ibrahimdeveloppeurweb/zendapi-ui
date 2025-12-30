import { TestBed } from '@angular/core/testing';

import { WorksiteService } from './worksite.service';

describe('WorksiteService', () => {
  let service: WorksiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorksiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
