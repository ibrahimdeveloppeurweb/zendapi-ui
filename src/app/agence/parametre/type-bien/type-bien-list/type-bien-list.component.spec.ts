import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeBienListComponent } from './type-bien-list.component';

describe('TypeBienListComponent', () => {
  let component: TypeBienListComponent;
  let fixture: ComponentFixture<TypeBienListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeBienListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeBienListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
