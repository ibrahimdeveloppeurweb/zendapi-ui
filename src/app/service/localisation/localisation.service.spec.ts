
import { TestBed } from '@angular/core/testing';

import { LocalisationService } from './localisation.service';

describe('LocalisationService', () => {
  let service: LocalisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalisationService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
