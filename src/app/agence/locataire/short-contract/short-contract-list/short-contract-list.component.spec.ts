import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortContractListComponent } from './short-contract-list.component';

describe('ShortContractListComponent', () => {
  let component: ShortContractListComponent;
  let fixture: ComponentFixture<ShortContractListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortContractListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
