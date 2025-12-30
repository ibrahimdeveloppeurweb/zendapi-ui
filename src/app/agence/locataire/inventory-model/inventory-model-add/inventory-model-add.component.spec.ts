import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryModelAddComponent } from './inventory-model-add.component';

describe('InventoryModelAddComponent', () => {
  let component: InventoryModelAddComponent;
  let fixture: ComponentFixture<InventoryModelAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryModelAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryModelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
