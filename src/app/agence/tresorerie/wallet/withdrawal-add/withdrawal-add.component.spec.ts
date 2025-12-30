import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalAddComponent } from './withdrawal-add.component';

describe('WithdrawalAddComponent', () => {
  let component: WithdrawalAddComponent;
  let fixture: ComponentFixture<WithdrawalAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawalAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
