import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandLivreListComponent } from './grand-livre-list.component';

describe('GrandLivreListComponent', () => {
  let component: GrandLivreListComponent;
  let fixture: ComponentFixture<GrandLivreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrandLivreListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrandLivreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
