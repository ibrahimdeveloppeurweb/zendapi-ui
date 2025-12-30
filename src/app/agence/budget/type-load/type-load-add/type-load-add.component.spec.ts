import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeLoadAddComponent } from './type-load-add.component';

describe('TypeLoadAddComponent', () => {
  let component: TypeLoadAddComponent;
  let fixture: ComponentFixture<TypeLoadAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeLoadAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeLoadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
