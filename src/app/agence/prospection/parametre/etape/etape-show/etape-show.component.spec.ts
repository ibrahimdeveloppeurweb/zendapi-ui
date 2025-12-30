import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapeShowComponent } from './etape-show.component';

describe('EtapeShowComponent', () => {
  let component: EtapeShowComponent;
  let fixture: ComponentFixture<EtapeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtapeShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
