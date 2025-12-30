import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TantiemeListComponent } from './tantieme-list.component';

describe('TantiemeListComponent', () => {
  let component: TantiemeListComponent;
  let fixture: ComponentFixture<TantiemeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TantiemeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TantiemeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
