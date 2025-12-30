import { TestBed } from '@angular/core/testing';

import { OffreTypeService } from './offre-type.service';

describe('OffreTypeService', () => {
  let service: OffreTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffreTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
