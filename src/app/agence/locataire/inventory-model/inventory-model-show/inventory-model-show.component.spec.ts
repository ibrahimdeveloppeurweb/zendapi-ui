import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryModelShowComponent } from './inventory-model-show.component';

describe('InventoryModelShowComponent', () => {
  let component: InventoryModelShowComponent;
  let fixture: ComponentFixture<InventoryModelShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryModelShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryModelShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
