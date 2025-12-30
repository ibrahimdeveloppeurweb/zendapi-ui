import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseAddComponent } from './response-add.component';

describe('ResponseAddComponent', () => {
  let component: ResponseAddComponent;
  let fixture: ComponentFixture<ResponseAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
