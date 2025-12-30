import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendListComponent } from './extend-list.component';

describe('ExtendListComponent', () => {
  let component: ExtendListComponent;
  let fixture: ComponentFixture<ExtendListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
