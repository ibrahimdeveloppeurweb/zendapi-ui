import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationShowComponent } from './reservation-show.component';

describe('ReservationShowComponent', () => {
  let component: ReservationShowComponent;
  let fixture: ComponentFixture<ReservationShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
