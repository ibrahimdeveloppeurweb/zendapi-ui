import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousFamilleAddComponent } from './sous-famille-add.component';

describe('SousFamilleAddComponent', () => {
  let component: SousFamilleAddComponent;
  let fixture: ComponentFixture<SousFamilleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousFamilleAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SousFamilleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
