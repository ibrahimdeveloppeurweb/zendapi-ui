import { TestBed } from '@angular/core/testing';

import { TicketChatService } from './ticket-chat.service';

describe('TicketChatService', () => {
  let service: TicketChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
