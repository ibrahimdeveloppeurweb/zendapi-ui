import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryModelListComponent } from './inventory-model-list.component';

describe('InventoryModelListComponent', () => {
  let component: InventoryModelListComponent;
  let fixture: ComponentFixture<InventoryModelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryModelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
