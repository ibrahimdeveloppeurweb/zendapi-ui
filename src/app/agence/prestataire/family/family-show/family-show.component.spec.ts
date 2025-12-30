import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyShowComponent } from './family-show.component';

describe('FamilyShowComponent', () => {
  let component: FamilyShowComponent;
  let fixture: ComponentFixture<FamilyShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
