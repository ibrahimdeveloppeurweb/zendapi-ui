import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerReleveComponent } from './owner-releve.component';

describe('OwnerReleveComponent', () => {
  let component: OwnerReleveComponent;
  let fixture: ComponentFixture<OwnerReleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerReleveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerReleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
