import { TestBed } from '@angular/core/testing';

import { LoadCategoryService } from './load-category.service';

describe('LoadCategoryService', () => {
  let service: LoadCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
