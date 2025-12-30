import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashWalletComponent } from './dash-wallet.component';

describe('DashPromotionComponent', () => {
  let component: DashWalletComponent;
  let fixture: ComponentFixture<DashWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
