import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { Component, Input, OnInit } from '@angular/core';
import { ReservationService } from '@service/reservation/reservation.service';
import { ReservationAddComponent } from '../reservation-add/reservation-add.component';
import { ReservationShowComponent } from '../reservation-show/reservation-show.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  @Input() reservations: any[]
  publicUrl = environment.publicUrl
  userSession = Globals.user
  global = {
    device: Globals.device
  }

  constructor(
    private modalService: NgbModal,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
  }

  show(item){
    this.reservationService.setReservation(item);
    this.modal(ReservationShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  edit(item){
    this.reservationService.setReservation(item);
    this.reservationService.edit = true;
    this.modal(ReservationAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printer(item)  {
    this.reservationService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, item?.uuid);
  }

  delete(item){

  }
  modal(component, type, size, center, backdrop): void {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }
}
