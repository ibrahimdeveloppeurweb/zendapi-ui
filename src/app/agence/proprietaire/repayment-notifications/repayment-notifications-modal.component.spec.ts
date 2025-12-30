import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepaymentNotificationsModalComponent } from './repayment-notifications-modal.component';

describe('RepaymentNotificationsModalComponent', () => {
  let component: RepaymentNotificationsModalComponent;
  let fixture: ComponentFixture<RepaymentNotificationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentNotificationsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentNotificationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
