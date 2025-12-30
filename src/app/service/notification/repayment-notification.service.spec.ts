import { TestBed } from '@angular/core/testing';
import { RepaymentNotificationService } from './repayment-notification.service';

describe('RepaymentNotificationService', () => {
  let service: RepaymentNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepaymentNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
