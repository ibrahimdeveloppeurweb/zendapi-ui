import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceAddComponent } from './balance-add.component';

describe('BalanceAddComponent', () => {
  let component: BalanceAddComponent;
  let fixture: ComponentFixture<BalanceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
