import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousFamilleShowComponent } from './sous-famille-show.component';

describe('SousFamilleShowComponent', () => {
  let component: SousFamilleShowComponent;
  let fixture: ComponentFixture<SousFamilleShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousFamilleShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SousFamilleShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
