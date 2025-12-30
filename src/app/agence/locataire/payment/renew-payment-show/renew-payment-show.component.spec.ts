import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewPaymentShowComponent } from './renew-payment-show.component';

describe('RenewPaymentShowComponent', () => {
  let component: RenewPaymentShowComponent;
  let fixture: ComponentFixture<RenewPaymentShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewPaymentShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewPaymentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
