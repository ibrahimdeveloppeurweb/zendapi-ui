import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TantiemeAddComponent } from './tantieme-add.component';

describe('TantiemeAddComponent', () => {
  let component: TantiemeAddComponent;
  let fixture: ComponentFixture<TantiemeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TantiemeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TantiemeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
