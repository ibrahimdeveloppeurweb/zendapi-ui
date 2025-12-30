import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderContractAddComponent } from './provider-contract-add.component';

describe('ProviderContractAddComponent', () => {
  let component: ProviderContractAddComponent;
  let fixture: ComponentFixture<ProviderContractAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderContractAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderContractAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
