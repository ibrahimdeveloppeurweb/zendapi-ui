import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilleAddComponent } from './famille-add.component';

describe('FamilleAddComponent', () => {
  let component: FamilleAddComponent;
  let fixture: ComponentFixture<FamilleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilleAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
