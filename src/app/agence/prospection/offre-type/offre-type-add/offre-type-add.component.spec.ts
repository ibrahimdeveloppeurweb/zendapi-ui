import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreTypeAddComponent } from './offre-type-add.component';

describe('OffreTypeAddComponent', () => {
  let component: OffreTypeAddComponent;
  let fixture: ComponentFixture<OffreTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffreTypeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
