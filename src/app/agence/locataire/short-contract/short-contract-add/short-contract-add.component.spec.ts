import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortContractAddComponent } from './short-contract-add.component';

describe('ShortContractAddComponent', () => {
  let component: ShortContractAddComponent;
  let fixture: ComponentFixture<ShortContractAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortContractAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortContractAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
