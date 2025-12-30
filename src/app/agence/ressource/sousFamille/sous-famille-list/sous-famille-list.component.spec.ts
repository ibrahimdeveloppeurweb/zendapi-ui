import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousFamilleListComponent } from './sous-famille-list.component';

describe('SousFamilleListComponent', () => {
  let component: SousFamilleListComponent;
  let fixture: ComponentFixture<SousFamilleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousFamilleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SousFamilleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
