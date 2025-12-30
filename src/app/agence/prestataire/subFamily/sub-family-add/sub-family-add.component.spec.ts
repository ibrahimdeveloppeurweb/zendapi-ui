import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFamilyAddComponent } from './sub-family-add.component';

describe('SubFamilyAddComponent', () => {
  let component: SubFamilyAddComponent;
  let fixture: ComponentFixture<SubFamilyAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFamilyAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubFamilyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
