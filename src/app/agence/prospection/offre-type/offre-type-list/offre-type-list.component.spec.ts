import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreTypeListComponent } from './offre-type-list.component';

describe('OffreTypeListComponent', () => {
  let component: OffreTypeListComponent;
  let fixture: ComponentFixture<OffreTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffreTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
