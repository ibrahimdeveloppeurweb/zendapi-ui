import { Injectable, NgZone } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercureService {

  private urlBase = environment.mercureUrl;
  constructor(private zone: NgZone) { }
  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }

  getServerSentEvent(url: string): Observable<MessageEvent> {
    const uri = new URL(this.urlBase);
    uri.searchParams.append('topic', `${url}`);
    return new Observable(observer => {
      const eventSource = this.getEventSource(`${uri}`);
      eventSource.onmessage = event => {
        this.zone.run(() => observer.next(event));
      };
    });
  }
}
