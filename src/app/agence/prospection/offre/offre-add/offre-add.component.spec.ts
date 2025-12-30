import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreAddComponent } from './offre-add.component';

describe('OffreAddComponent', () => {
  let component: OffreAddComponent;
  let fixture: ComponentFixture<OffreAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffreAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
