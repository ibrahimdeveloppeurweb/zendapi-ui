import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerWalletComponent } from './owner-wallet.component';

describe('OwnerWalletComponent', () => {
  let component: OwnerWalletComponent;
  let fixture: ComponentFixture<OwnerWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
