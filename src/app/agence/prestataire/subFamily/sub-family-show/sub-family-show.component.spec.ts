import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFamilyShowComponent } from './sub-family-show.component';

describe('SubFamilyShowComponent', () => {
  let component: SubFamilyShowComponent;
  let fixture: ComponentFixture<SubFamilyShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFamilyShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubFamilyShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
