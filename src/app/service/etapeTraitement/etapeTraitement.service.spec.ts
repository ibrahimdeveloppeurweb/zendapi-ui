import { TestBed } from '@angular/core/testing';

import { EtapeTraitementService } from './etapeTraitement.service';

describe('EtapeTraitementService', () => {
  let service: EtapeTraitementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtapeTraitementService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
