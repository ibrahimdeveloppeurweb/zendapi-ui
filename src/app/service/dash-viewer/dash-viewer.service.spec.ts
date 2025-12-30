import { TestBed } from '@angular/core/testing';

import { DashViewerService } from './dash-viewer.service';

describe('DashViewerService', () => {
  let service: DashViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
