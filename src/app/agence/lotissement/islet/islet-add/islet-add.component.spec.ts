import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsletAddComponent } from './islet-add.component';

describe('IsletAddComponent', () => {
  let component: IsletAddComponent;
  let fixture: ComponentFixture<IsletAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsletAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsletAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
