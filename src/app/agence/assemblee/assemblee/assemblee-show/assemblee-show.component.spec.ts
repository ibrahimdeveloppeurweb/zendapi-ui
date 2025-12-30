import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssembleeShowComponent } from './assemblee-show.component';

describe('AssembleeShowComponent', () => {
  let component: AssembleeShowComponent;
  let fixture: ComponentFixture<AssembleeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssembleeShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssembleeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
