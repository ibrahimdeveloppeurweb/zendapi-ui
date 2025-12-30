import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilleShowComponent } from './famille-show.component';

describe('FamilleShowComponent', () => {
  let component: FamilleShowComponent;
  let fixture: ComponentFixture<FamilleShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilleShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilleShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
