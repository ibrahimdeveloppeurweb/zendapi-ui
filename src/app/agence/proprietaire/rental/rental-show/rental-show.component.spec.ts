import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalShowComponent } from './rental-show.component';

describe('RentalShowComponent', () => {
  let component: RentalShowComponent;
  let fixture: ComponentFixture<RentalShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
