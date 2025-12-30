import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFamilyListComponent } from './sub-family-list.component';

describe('SubFamilyListComponent', () => {
  let component: SubFamilyListComponent;
  let fixture: ComponentFixture<SubFamilyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFamilyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubFamilyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
