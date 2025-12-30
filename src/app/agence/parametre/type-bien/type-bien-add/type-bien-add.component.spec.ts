import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeBienAddComponent } from './type-bien-add.component';

describe('TypeBienAddComponent', () => {
  let component: TypeBienAddComponent;
  let fixture: ComponentFixture<TypeBienAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeBienAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeBienAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
