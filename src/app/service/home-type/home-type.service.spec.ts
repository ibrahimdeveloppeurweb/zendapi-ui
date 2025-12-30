import { TestBed } from '@angular/core/testing';

import { HomeTypeService } from './home-type.service';

describe('HomeTypeService', () => {
  let service: HomeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
