import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssembleeAddComponent } from './assemblee-add.component';

describe('AssembleeAddComponent', () => {
  let component: AssembleeAddComponent;
  let fixture: ComponentFixture<AssembleeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssembleeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssembleeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
