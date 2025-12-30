import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseShowComponent } from './house-show.component';

describe('HouseShowComponent', () => {
  let component: HouseShowComponent;
  let fixture: ComponentFixture<HouseShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
