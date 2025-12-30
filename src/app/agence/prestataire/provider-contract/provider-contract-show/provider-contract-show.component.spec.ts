import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderContractShowComponent } from './provider-contract-show.component';

describe('ProviderContractShowComponent', () => {
  let component: ProviderContractShowComponent;
  let fixture: ComponentFixture<ProviderContractShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderContractShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderContractShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
