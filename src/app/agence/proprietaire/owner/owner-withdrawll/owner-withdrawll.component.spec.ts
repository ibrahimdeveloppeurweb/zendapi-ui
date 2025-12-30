import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerWithdrawllComponent } from './owner-withdrawll.component';

describe('OwnerWithdrawllComponent', () => {
  let component: OwnerWithdrawllComponent;
  let fixture: ComponentFixture<OwnerWithdrawllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerWithdrawllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerWithdrawllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
