import { TestBed } from '@angular/core/testing';
import { dashboardPromotionService } from './dashboard-promotion.service';

describe('dashboardPromotionService', () => {
  let service: dashboardPromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dashboardPromotionService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
