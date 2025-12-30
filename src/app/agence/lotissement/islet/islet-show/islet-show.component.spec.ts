import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsletShowComponent } from './islet-show.component';

describe('IsletShowComponent', () => {
  let component: IsletShowComponent;
  let fixture: ComponentFixture<IsletShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsletShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsletShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
