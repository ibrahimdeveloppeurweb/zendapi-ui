import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashRessourceComponent } from './dash-ressource.component';

describe('DashRessourceComponent', () => {
  let component: DashRessourceComponent;
  let fixture: ComponentFixture<DashRessourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashRessourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
