import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsApealsListComponent } from './funds-apeals-list.component';

describe('FundsApealsListComponent', () => {
  let component: FundsApealsListComponent;
  let fixture: ComponentFixture<FundsApealsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsApealsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsApealsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
