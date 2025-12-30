import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityShowComponent } from './city-show.component';

describe('CityShowComponent', () => {
  let component: CityShowComponent;
  let fixture: ComponentFixture<CityShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
