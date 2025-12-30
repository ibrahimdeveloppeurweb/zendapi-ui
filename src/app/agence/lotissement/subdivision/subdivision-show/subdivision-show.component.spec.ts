import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionShowComponent } from './subdivision-show.component';

describe('SubdivisionShowComponent', () => {
  let component: SubdivisionShowComponent;
  let fixture: ComponentFixture<SubdivisionShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubdivisionShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubdivisionShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
