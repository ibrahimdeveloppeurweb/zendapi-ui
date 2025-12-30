import { TestBed } from '@angular/core/testing';

import { RessourceTiersService } from './ressource-tiers.service';

describe('RessourceTiersService', () => {
  let service: RessourceTiersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RessourceTiersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
