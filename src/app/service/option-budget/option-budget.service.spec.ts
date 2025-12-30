import { TestBed } from '@angular/core/testing';

import { OptionBudgetService } from './option-budget.service';

describe('OptionBudgetService', () => {
  let service: OptionBudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionBudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
