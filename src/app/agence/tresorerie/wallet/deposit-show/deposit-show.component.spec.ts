import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositShowComponent } from './deposit-show.component';

describe('DepositShowComponent', () => {
  let component: DepositShowComponent;
  let fixture: ComponentFixture<DepositShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
