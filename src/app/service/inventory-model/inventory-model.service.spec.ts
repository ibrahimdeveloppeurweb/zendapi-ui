import { TestBed } from '@angular/core/testing';

import { InventoryModelService } from './inventory-model.service';

describe('InventoryModelService', () => {
  let service: InventoryModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryModelService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
