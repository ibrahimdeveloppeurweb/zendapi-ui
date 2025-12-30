import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionShowComponent } from './production-show.component';

describe('ProductionShowComponent', () => {
  let component: ProductionShowComponent;
  let fixture: ComponentFixture<ProductionShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
