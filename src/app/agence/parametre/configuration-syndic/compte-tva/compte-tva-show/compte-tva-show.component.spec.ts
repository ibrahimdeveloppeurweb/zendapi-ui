import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteTvaShowComponent } from './compte-tva-show.component';

describe('CompteTvaShowComponent', () => {
  let component: CompteTvaShowComponent;
  let fixture: ComponentFixture<CompteTvaShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompteTvaShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteTvaShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
