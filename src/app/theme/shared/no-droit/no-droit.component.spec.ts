import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDroitComponent } from './no-droit.component';

describe('NoDroitComponent', () => {
  let component: NoDroitComponent;
  let fixture: ComponentFixture<NoDroitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDroitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDroitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
