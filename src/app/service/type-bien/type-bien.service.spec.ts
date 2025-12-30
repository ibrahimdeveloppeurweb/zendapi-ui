import { TestBed } from '@angular/core/testing';

import { TypeBienService } from './type-bien.service';

describe('TypeBienService', () => {
  let service: TypeBienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeBienService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
