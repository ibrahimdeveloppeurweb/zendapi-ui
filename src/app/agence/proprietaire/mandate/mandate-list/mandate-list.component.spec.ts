import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateListComponent } from './mandate-list.component';

describe('MandateListComponent', () => {
  let component: MandateListComponent;
  let fixture: ComponentFixture<MandateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
