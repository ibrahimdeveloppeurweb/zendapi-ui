import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionTableComponent } from './construction-table.component';

describe('ConstructionTableComponent', () => {
  let component: ConstructionTableComponent;
  let fixture: ComponentFixture<ConstructionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructionTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
