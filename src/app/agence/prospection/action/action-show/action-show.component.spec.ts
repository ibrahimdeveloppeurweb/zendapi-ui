import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionShowComponent } from './action-show.component';

describe('ActionShowComponent', () => {
  let component: ActionShowComponent;
  let fixture: ComponentFixture<ActionShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
