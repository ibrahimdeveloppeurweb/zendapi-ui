import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceListComponent } from './piece-list.component';

describe('PieceListComponent', () => {
  let component: PieceListComponent;
  let fixture: ComponentFixture<PieceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
