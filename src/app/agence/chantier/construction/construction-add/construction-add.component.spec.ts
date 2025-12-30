import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionAddComponent } from './construction-add.component';

describe('ConstructionAddComponent', () => {
  let component: ConstructionAddComponent;
  let fixture: ComponentFixture<ConstructionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
