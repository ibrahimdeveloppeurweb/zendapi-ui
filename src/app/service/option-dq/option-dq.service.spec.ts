import { TestBed } from '@angular/core/testing';

import { OptionDqService } from './option-dq.service';

describe('OptionDqService', () => {
  let service: OptionDqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionDqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
