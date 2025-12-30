import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalShowComponent } from './withdrawal-show.component';

describe('WithdrawalShowComponent', () => {
  let component: WithdrawalShowComponent;
  let fixture: ComponentFixture<WithdrawalShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawalShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
