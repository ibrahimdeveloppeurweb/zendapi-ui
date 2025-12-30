import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashLotissementComponent } from './dash-lotissement.component';

describe('DashLotissementComponent', () => {
  let component: DashLotissementComponent;
  let fixture: ComponentFixture<DashLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
