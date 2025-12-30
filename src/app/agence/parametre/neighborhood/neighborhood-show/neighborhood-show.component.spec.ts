import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodShowComponent } from './neighborhood-show.component';

describe('NeighborhoodShowComponent', () => {
  let component: NeighborhoodShowComponent;
  let fixture: ComponentFixture<NeighborhoodShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeighborhoodShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
