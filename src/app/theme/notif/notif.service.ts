import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifService {

  constructor(public toast: ToastrService) {}

  public notifSuccess(title, msg, time, position) {
    this.toast.success(title, msg, {
      timeOut: time,
      positionClass: position,
      toastClass: 'ngx-toastr'
    })
  }
}
