import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewContractListComponent } from './renew-contract-list.component';

describe('RenewContractListComponent', () => {
  let component: RenewContractListComponent;
  let fixture: ComponentFixture<RenewContractListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewContractListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
