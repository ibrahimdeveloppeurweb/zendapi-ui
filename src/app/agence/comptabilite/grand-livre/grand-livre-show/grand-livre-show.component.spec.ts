import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandLivreShowComponent } from './grand-livre-show.component';

describe('GrandLivreShowComponent', () => {
  let component: GrandLivreShowComponent;
  let fixture: ComponentFixture<GrandLivreShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrandLivreShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrandLivreShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
