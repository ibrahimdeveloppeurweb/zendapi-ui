import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentShowComponent } from './equipment-show.component';

describe('EquipmentShowComponent', () => {
  let component: EquipmentShowComponent;
  let fixture: ComponentFixture<EquipmentShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
