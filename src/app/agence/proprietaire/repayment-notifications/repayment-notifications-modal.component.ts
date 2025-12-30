import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RepaymentNotificationService } from '@service/notification/repayment-notification.service';
import { RepaymentNotification } from '@model/repayment-notification';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-repayment-notifications-modal',
  templateUrl: './repayment-notifications-modal.component.html',
  styleUrls: ['./repayment-notifications-modal.component.scss']
})
export class RepaymentNotificationsModalComponent implements OnInit, OnDestroy {
  notifications: RepaymentNotification[] = [];
  loading: boolean = false;
  activeTab: string = 'all'; // all, overdue
  private subscription: Subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: RepaymentNotificationService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadNotifications(): void {
    this.loading = true;
    
    const observable = this.activeTab === 'overdue' 
      ? this.notificationService.getOverdue()
      : this.notificationService.getAll(); // Récupérer TOUTES les notifications

    this.subscription.add(
      observable.subscribe(
        (data: any) => {
          this.notifications = data.notifications || [];
          this.loading = false;
        },
        (error) => {
          console.error('Erreur lors du chargement des notifications', error);
          this.loading = false;
          Swal.fire('Erreur', 'Impossible de charger les notifications', 'error');
        }
      )
    );
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.loadNotifications();
  }

  markAsRead(notification: RepaymentNotification): void {
    this.notificationService.markAsRead(notification.uuid).subscribe(
      () => {
        // Retirer de la liste
        const index = this.notifications.findIndex(n => n.id === notification.id);
        if (index !== -1) {
          this.notifications.splice(index, 1);
        }
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Notification marquée comme lue',
          showConfirmButton: false,
          timer: 2000
        });
      },
      (error) => {
        console.error('Erreur lors de la mise à jour', error);
        Swal.fire('Erreur', 'Impossible de marquer comme lue', 'error');
      }
    );
  }

  dismiss(notification: RepaymentNotification): void {
    this.notificationService.dismiss(notification.uuid).subscribe(
      () => {
        // Retirer de la liste
        const index = this.notifications.findIndex(n => n.id === notification.id);
        if (index !== -1) {
          this.notifications.splice(index, 1);
        }
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Notification ignorée',
          showConfirmButton: false,
          timer: 2000
        });
      },
      (error) => {
        console.error('Erreur lors de la suppression', error);
        Swal.fire('Erreur', 'Impossible d\'ignorer la notification', 'error');
      }
    );
  }

  markAllAsRead(): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous marquer toutes les notifications comme lues ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificationService.markAllAsRead().subscribe(
          () => {
            this.notifications = [];
            Swal.fire('Succès', 'Toutes les notifications ont été marquées comme lues', 'success');
          },
          (error) => {
            console.error('Erreur', error);
            Swal.fire('Erreur', 'Impossible de marquer toutes les notifications', 'error');
          }
        );
      }
    });
  }

  getNotificationClass(notification: RepaymentNotification): string {
    if (notification.type === 'OVERDUE') {
      return 'notification-danger';
    } else if (notification.type === 'REMINDER') {
      return 'notification-warning';
    }
    return 'notification-info';
  }

  getNotificationIcon(notification: RepaymentNotification): string {
    if (notification.type === 'OVERDUE') {
      return 'feather icon-alert-triangle';
    } else if (notification.type === 'REMINDER') {
      return 'feather icon-bell';
    }
    return 'feather icon-info';
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' FCFA';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
