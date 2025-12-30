import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceAddComponent } from './piece-add.component';

describe('PieceAddComponent', () => {
  let component: PieceAddComponent;
  let fixture: ComponentFixture<PieceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieceAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
