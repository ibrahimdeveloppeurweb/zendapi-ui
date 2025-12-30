import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortContractShowComponent } from './short-contract-show.component';

describe('ShortContractShowComponent', () => {
  let component: ShortContractShowComponent;
  let fixture: ComponentFixture<ShortContractShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortContractShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortContractShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
