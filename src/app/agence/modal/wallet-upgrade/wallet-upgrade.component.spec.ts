import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletUpgradeComponent } from './wallet-upgrade.component';

describe('WalletUpgradeComponent', () => {
  let component: WalletUpgradeComponent;
  let fixture: ComponentFixture<WalletUpgradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletUpgradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
