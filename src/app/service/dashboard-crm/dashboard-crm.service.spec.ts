import { TestBed } from '@angular/core/testing';
import { dashboardCrmService } from './dashboard-crm.service';

describe('dashboardCrmService', () => {
  let service: dashboardCrmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dashboardCrmService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
