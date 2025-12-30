import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryShowComponent } from './treasury-show.component';

describe('TreasuryShowComponent', () => {
  let component: TreasuryShowComponent;
  let fixture: ComponentFixture<TreasuryShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreasuryShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
