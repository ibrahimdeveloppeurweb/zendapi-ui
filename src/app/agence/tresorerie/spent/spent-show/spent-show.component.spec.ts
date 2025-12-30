import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpentShowComponent } from './spent-show.component';

describe('SpentShowComponent', () => {
  let component: SpentShowComponent;
  let fixture: ComponentFixture<SpentShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpentShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
