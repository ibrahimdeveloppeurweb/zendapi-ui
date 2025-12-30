import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionListComponent } from './construction-list.component';

describe('ConstructionListComponent', () => {
  let component: ConstructionListComponent;
  let fixture: ComponentFixture<ConstructionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
