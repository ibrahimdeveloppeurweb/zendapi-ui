import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceShowComponent } from './piece-show.component';

describe('PieceShowComponent', () => {
  let component: PieceShowComponent;
  let fixture: ComponentFixture<PieceShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieceShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
