import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteTvaAddComponent } from './compte-tva-add.component';

describe('CompteTvaAddComponent', () => {
  let component: CompteTvaAddComponent;
  let fixture: ComponentFixture<CompteTvaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompteTvaAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteTvaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
