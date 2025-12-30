import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreTypeShowComponent } from './offre-type-show.component';

describe('OffreTypeShowComponent', () => {
  let component: OffreTypeShowComponent;
  let fixture: ComponentFixture<OffreTypeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffreTypeShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreTypeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
