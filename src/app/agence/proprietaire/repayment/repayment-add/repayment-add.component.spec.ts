import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentAddComponent } from './repayment-add.component';

describe('RepaymentAddComponent', () => {
  let component: RepaymentAddComponent;
  let fixture: ComponentFixture<RepaymentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepaymentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
