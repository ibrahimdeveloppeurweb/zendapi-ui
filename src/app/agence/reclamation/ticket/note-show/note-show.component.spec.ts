import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteShowComponent } from './note-show.component';

describe('NoteShowComponent', () => {
  let component: NoteShowComponent;
  let fixture: ComponentFixture<NoteShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
