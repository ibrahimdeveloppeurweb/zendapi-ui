import { TestBed } from '@angular/core/testing';

import { QuartierService } from './quartier.service';

describe('QuartierService', () => {
  let service: QuartierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuartierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
