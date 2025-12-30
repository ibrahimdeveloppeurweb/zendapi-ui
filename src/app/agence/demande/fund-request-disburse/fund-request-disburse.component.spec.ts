import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundRequestDisburseComponent } from './fund-request-disburse.component';

describe('FundRequestDisburseComponent', () => {
  let component: FundRequestDisburseComponent;
  let fixture: ComponentFixture<FundRequestDisburseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundRequestDisburseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundRequestDisburseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
