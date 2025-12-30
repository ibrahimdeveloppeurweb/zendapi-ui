import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/agence/proprietaire/house/house-share/house-share.component.spec.ts
import { HouseShareComponent } from './house-share.component';

describe('HouseShareComponent', () => {
  let component: HouseShareComponent;
  let fixture: ComponentFixture<HouseShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseShareComponent ]
========
import { SyndicMandateListComponent } from './syndic-mandate-list.component';

describe('SyndicMandateListComponent', () => {
  let component: SyndicMandateListComponent;
  let fixture: ComponentFixture<SyndicMandateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicMandateListComponent ]
>>>>>>>> dfd5c6c48900c624534ca83419cb570866fdd677:src/app/agence/syndic/syndic-mandate/syndic-mandate-list/syndic-mandate-list.component.spec.ts
    })
    .compileComponents();
  });

  beforeEach(() => {
<<<<<<<< HEAD:src/app/agence/proprietaire/house/house-share/house-share.component.spec.ts
    fixture = TestBed.createComponent(HouseShareComponent);
========
    fixture = TestBed.createComponent(SyndicMandateListComponent);
>>>>>>>> dfd5c6c48900c624534ca83419cb570866fdd677:src/app/agence/syndic/syndic-mandate/syndic-mandate-list/syndic-mandate-list.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
