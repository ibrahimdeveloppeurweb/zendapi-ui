import { TestBed } from '@angular/core/testing';

import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let service: TenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
