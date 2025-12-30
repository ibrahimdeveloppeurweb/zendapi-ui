import { TestBed } from '@angular/core/testing';
import { dashboardLotissementService } from './dashboard-lotissement.service';

describe('dashboardPromotionService', () => {
  let service: dashboardLotissementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dashboardLotissementService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
