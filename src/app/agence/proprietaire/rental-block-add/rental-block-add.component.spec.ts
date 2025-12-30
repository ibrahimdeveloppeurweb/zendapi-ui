import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalBlockAddComponent } from './rental-block-add.component';

describe('RentalBlockAddComponent', () => {
  let component: RentalBlockAddComponent;
  let fixture: ComponentFixture<RentalBlockAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalBlockAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalBlockAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
