import { TestBed } from '@angular/core/testing';

import { SubFamilyService } from './sub-family.service';

describe('SubFamilyService', () => {
  let service: SubFamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubFamilyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
