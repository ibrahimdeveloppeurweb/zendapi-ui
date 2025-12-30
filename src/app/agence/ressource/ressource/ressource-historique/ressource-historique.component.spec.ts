import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourceHistoriqueComponent } from './ressource-historique.component';

describe('RessourceHistoriqueComponent', () => {
  let component: RessourceHistoriqueComponent;
  let fixture: ComponentFixture<RessourceHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RessourceHistoriqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourceHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
