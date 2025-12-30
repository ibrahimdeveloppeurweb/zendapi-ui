import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteTvaListComponent } from './compte-tva-list.component';

describe('CompteTvaListComponent', () => {
  let component: CompteTvaListComponent;
  let fixture: ComponentFixture<CompteTvaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompteTvaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteTvaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
