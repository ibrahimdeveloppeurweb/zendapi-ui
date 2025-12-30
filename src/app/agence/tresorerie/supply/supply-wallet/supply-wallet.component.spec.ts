import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyWalletComponent } from './supply-wallet.component';

describe('SupplyWalletComponent', () => {
  let component: SupplyWalletComponent;
  let fixture: ComponentFixture<SupplyWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplyWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
