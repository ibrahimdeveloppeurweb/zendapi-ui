import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceShowComponent } from './balance-show.component';

describe('BalanceShowComponent', () => {
  let component: BalanceShowComponent;
  let fixture: ComponentFixture<BalanceShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
