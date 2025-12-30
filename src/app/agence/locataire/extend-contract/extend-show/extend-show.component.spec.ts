import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendShowComponent } from './extend-show.component';

describe('ExtendShowComponent', () => {
  let component: ExtendShowComponent;
  let fixture: ComponentFixture<ExtendShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
