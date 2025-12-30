import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssembleeListComponent } from './assemblee-list.component';

describe('AssembleeListComponent', () => {
  let component: AssembleeListComponent;
  let fixture: ComponentFixture<AssembleeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssembleeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssembleeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
