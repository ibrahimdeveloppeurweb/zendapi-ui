import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashLocataireComponent } from './dash-locataire.component';

describe('DashLocataireComponent', () => {
  let component: DashLocataireComponent;
  let fixture: ComponentFixture<DashLocataireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashLocataireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashLocataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
