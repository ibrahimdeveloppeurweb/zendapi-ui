import { TestBed } from '@angular/core/testing';

import { PaymentReservationService } from './payment-reservation.service';

describe('PaymentReservationService', () => {
  let service: PaymentReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
