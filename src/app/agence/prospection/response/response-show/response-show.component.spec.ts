import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseShowComponent } from './response-show.component';

describe('ResponseShowComponent', () => {
  let component: ResponseShowComponent;
  let fixture: ComponentFixture<ResponseShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
