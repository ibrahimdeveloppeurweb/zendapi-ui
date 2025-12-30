import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicCondominiumAddComponent } from './syndic-condominium-add.component';

describe('SyndicCondominiumAddComponent', () => {
  let component: SyndicCondominiumAddComponent;
  let fixture: ComponentFixture<SyndicCondominiumAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicCondominiumAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicCondominiumAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
