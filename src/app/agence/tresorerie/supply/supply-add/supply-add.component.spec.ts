import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyAddComponent } from './supply-add.component';

describe('SupplyAddComponent', () => {
  let component: SupplyAddComponent;
  let fixture: ComponentFixture<SupplyAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
