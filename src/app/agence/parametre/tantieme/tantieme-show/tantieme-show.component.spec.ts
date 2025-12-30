import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TantiemeShowComponent } from './tantieme-show.component';

describe('TantiemeShowComponent', () => {
  let component: TantiemeShowComponent;
  let fixture: ComponentFixture<TantiemeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TantiemeShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TantiemeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
