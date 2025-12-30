import { TestBed } from '@angular/core/testing';

import { SettingService } from './sitting.service';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
