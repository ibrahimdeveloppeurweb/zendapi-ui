import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMaskComponent } from './contact-mask.component';

describe('ContactMaskComponent', () => {
  let component: ContactMaskComponent;
  let fixture: ComponentFixture<ContactMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactMaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
