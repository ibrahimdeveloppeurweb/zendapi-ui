import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailAddComponent } from './mail-add.component';

describe('MailAddComponent', () => {
  let component: MailAddComponent;
  let fixture: ComponentFixture<MailAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
