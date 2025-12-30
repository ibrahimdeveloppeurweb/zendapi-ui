import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreShowComponent } from './offre-show.component';

describe('OffreShowComponent', () => {
  let component: OffreShowComponent;
  let fixture: ComponentFixture<OffreShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffreShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
