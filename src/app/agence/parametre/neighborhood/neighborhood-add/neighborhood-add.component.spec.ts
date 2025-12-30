import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodAddComponent } from './neighborhood-add.component';

describe('NeighborhoodAddComponent', () => {
  let component: NeighborhoodAddComponent;
  let fixture: ComponentFixture<NeighborhoodAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeighborhoodAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
