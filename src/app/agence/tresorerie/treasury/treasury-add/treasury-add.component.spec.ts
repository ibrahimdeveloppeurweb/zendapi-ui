import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryAddComponent } from './treasury-add.component';

describe('TreasuryAddComponent', () => {
  let component: TreasuryAddComponent;
  let fixture: ComponentFixture<TreasuryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreasuryAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
