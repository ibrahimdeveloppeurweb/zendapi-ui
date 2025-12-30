import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewPaymentListComponent } from './renew-payment-list.component';

describe('RenewPaymentListComponent', () => {
  let component: RenewPaymentListComponent;
  let fixture: ComponentFixture<RenewPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
