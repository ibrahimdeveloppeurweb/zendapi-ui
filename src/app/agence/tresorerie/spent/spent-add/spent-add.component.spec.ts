import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpentAddComponent } from './spent-add.component';

describe('SpentAddComponent', () => {
  let component: SpentAddComponent;
  let fixture: ComponentFixture<SpentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
