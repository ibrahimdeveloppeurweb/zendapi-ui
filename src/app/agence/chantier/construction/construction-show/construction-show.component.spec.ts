import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionShowComponent } from './construction-show.component';

describe('ConstructionShowComponent', () => {
  let component: ConstructionShowComponent;
  let fixture: ComponentFixture<ConstructionShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
