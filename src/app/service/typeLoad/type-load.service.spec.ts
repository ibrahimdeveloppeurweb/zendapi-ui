import { TestBed } from '@angular/core/testing';

import { TypeLoadService } from './type-load.service';

describe('TypeLoadService', () => {
  let service: TypeLoadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeLoadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
