import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourceShowComponent } from './ressource-show.component';

describe('RessourceShowComponent', () => {
  let component: RessourceShowComponent;
  let fixture: ComponentFixture<RessourceShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RessourceShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
