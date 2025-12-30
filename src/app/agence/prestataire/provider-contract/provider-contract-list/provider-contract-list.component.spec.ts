import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderContractListComponent } from './provider-contract-list.component';

describe('ProviderContractListComponent', () => {
  let component: ProviderContractListComponent;
  let fixture: ComponentFixture<ProviderContractListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderContractListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
