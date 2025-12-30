import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionAddComponent } from './subdivision-add.component';

describe('SubdivisionAddComponent', () => {
  let component: SubdivisionAddComponent;
  let fixture: ComponentFixture<SubdivisionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubdivisionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubdivisionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
