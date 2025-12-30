import { TestBed } from '@angular/core/testing';

import { ActionCommercialService } from './action-commercial.service';

describe('ActionCommercialService', () => {
  let service: ActionCommercialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionCommercialService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
