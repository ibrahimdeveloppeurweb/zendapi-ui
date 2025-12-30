import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentShowComponent } from './rent-show.component';

describe('RentShowComponent', () => {
  let component: RentShowComponent;
  let fixture: ComponentFixture<RentShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
