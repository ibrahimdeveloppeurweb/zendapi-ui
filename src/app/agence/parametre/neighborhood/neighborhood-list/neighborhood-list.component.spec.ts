import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodListComponent } from './neighborhood-list.component';

describe('NeighborhoodListComponent', () => {
  let component: NeighborhoodListComponent;
  let fixture: ComponentFixture<NeighborhoodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeighborhoodListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
