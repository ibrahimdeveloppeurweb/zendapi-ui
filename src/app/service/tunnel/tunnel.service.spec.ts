import { TestBed } from '@angular/core/testing';

import { TunnelService } from './tunnel.service';

describe('TunnelService', () => {
  let service: TunnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TunnelService);
  });

  it('should be createdAt', () => {
    expect(service).toBeTruthy();
  });
});
