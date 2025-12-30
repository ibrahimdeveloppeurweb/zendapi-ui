import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyShowComponent } from './supply-show.component';

describe('SupplyShowComponent', () => {
  let component: SupplyShowComponent;
  let fixture: ComponentFixture<SupplyShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
