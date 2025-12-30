import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './category.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
