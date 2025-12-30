import { TestBed } from '@angular/core/testing';

import { SupplierCategoryService } from './supplier-category.service';

describe('SupplierCategoryService', () => {
  let service: SupplierCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
