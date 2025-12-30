import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpentListComponent } from './spent-list.component';

describe('SpentListComponent', () => {
  let component: SpentListComponent;
  let fixture: ComponentFixture<SpentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
