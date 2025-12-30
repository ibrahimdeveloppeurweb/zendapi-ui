import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';

describe('EquipmentService', () => {
  let service: EquipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
