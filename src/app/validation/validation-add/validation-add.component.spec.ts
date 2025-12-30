import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationAddComponent } from './validation-add.component';

describe('ValidationAddComponent', () => {
  let component: ValidationAddComponent;
  let fixture: ComponentFixture<ValidationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
