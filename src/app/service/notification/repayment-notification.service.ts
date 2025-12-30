import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { switchMap, startWith, tap, catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { RepaymentNotification, NotificationStats } from '@model/repayment-notification';

@Injectable({
  providedIn: 'root'
})
export class RepaymentNotificationService {
  private apiUrl = `${environment.serverUrl}/notifications/repayment`;
  
  // BehaviorSubject pour le compteur non lu (pour le badge)
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    // Démarrer le polling du compteur au démarrage du service
    //this.startUnreadCountPolling();
  }

  /**
   * Récupérer toutes les notifications
   */
  getAll(limit?: number): Observable<any> {
    const url = limit ? `${this.apiUrl}?limit=${limit}` : this.apiUrl;
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        // Adapter la structure de réponse pour qu'elle corresponde à l'ancien format
        return {
          notifications: response.data?.notifications || [],
          unread_count: response.data?.unread_count || 0
        };
      })
    );
  }

  /**
   * Récupérer uniquement les notifications non lues
   */
  getUnread(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/unread`).pipe(
      map((response: any) => {
        return {
          notifications: response.data?.notifications || [],
          count: response.data?.count || 0
        };
      })
    );
  }

  /**
   * Récupérer les notifications en retard
   */
  getOverdue(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/overdue`).pipe(
      map((response: any) => {
        return {
          notifications: response.data?.notifications || [],
          count: response.data?.count || 0
        };
      })
    );
  }

  /**
   * Compter les notifications non lues
   */
  getUnreadCount(): Observable<{ unread_count: number }> {
    return this.http.get<any>(`${this.apiUrl}/count`).pipe(
      map((response: any) => {
        const unreadCount = response.data?.unread_count || 0;
        // Mettre à jour le BehaviorSubject
        this.unreadCountSubject.next(unreadCount);
        return { unread_count: unreadCount };
      }),
      tap(response => {
        // Mettre à jour le BehaviorSubject
        this.unreadCountSubject.next(response.unread_count);
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du compteur', error);
        return [];
      })
    );
  }

  /**
   * Récupérer les statistiques
   */
  getStats(): Observable<NotificationStats> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      map((response: any) => response.data || {})
    );
  }

  /**
   * Marquer une notification comme lue
   */
  markAsRead(uuid: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${uuid}/read`, {}).pipe(
      tap(() => {
        // Décrémenter le compteur local
        const currentCount = this.unreadCountSubject.value;
        if (currentCount > 0) {
          this.unreadCountSubject.next(currentCount - 1);
        }
      })
    );
  }

  /**
   * Ignorer une notification
   */
  dismiss(uuid: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${uuid}/dismiss`, {}).pipe(
      tap(() => {
        // Décrémenter le compteur local
        const currentCount = this.unreadCountSubject.value;
        if (currentCount > 0) {
          this.unreadCountSubject.next(currentCount - 1);
        }
      })
    );
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        // Réinitialiser le compteur à 0
        this.unreadCountSubject.next(0);
      })
    );
  }

  /**
   * Polling automatique des notifications toutes les 5 minutes
   */
  pollNotifications(intervalMs: number = 5 * 60 * 1000): Observable<any> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.getUnread())
    );
  }

  /**
   * Polling du compteur non lu toutes les 30 secondes
   */
  pollUnreadCount(intervalMs: number = 30 * 1000): Observable<{ unread_count: number }> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.getUnreadCount())
    );
  }

  /**
   * Démarrer le polling automatique du compteur (appelé au démarrage)
   */
  private startUnreadCountPolling(): void {
    this.pollUnreadCount(60 * 1000).subscribe(); // Toutes les minutes
  }

  /**
   * Obtenir la valeur actuelle du compteur non lu
   */
  getCurrentUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /**
   * Rafraîchir manuellement le compteur
   */
  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe();
  }
}
