import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapeAddComponent } from './etape-add.component';

describe('EtapeAddComponent', () => {
  let component: EtapeAddComponent;
  let fixture: ComponentFixture<EtapeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtapeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
