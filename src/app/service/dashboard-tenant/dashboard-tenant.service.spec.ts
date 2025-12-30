import { TestBed } from '@angular/core/testing';
import { dashboardTenantService } from './dashboard-tenant.service';

describe('dashboardTenantService', () => {
  let service: dashboardTenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dashboardTenantService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
