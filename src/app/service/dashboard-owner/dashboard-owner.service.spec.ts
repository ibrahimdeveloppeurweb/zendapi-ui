import { TestBed } from '@angular/core/testing';
import { dashboardOwnerService } from './dashboard-owner.service';

describe('dashboardOwnerService', () => {
  let service: dashboardOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dashboardOwnerService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
