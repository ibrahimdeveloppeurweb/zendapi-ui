import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourceHorsUsageComponent } from './ressource-hors-usage.component';

describe('RessourceHorsUsageComponent', () => {
  let component: RessourceHorsUsageComponent;
  let fixture: ComponentFixture<RessourceHorsUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RessourceHorsUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourceHorsUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
