import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsletListComponent } from './islet-list.component';

describe('IsletListComponent', () => {
  let component: IsletListComponent;
  let fixture: ComponentFixture<IsletListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsletListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsletListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
