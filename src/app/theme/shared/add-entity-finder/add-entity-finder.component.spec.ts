import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntityFinderComponent } from './add-entity-finder.component';

describe('AddEntityFinderComponent', () => {
  let component: AddEntityFinderComponent;
  let fixture: ComponentFixture<AddEntityFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEntityFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntityFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
