import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProspectShowComponent } from './payment-prospect-show.component';

describe('PaymentProspectShowComponent', () => {
  let component: PaymentProspectShowComponent;
  let fixture: ComponentFixture<PaymentProspectShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentProspectShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentProspectShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
