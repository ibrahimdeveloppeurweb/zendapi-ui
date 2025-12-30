import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteDefautComponent } from './compte-defaut.component';

describe('CompteDefautComponent', () => {
  let component: CompteDefautComponent;
  let fixture: ComponentFixture<CompteDefautComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompteDefautComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteDefautComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
