import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnInit } from '@angular/core';
import { Rent } from '@model/rent';
import { PAYMENT } from '@theme/utils/functions';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RentService } from '@service/rent/rent.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-rent-show',
  templateUrl: './rent-show.component.html',
  styleUrls: ['./rent-show.component.scss']
})
export class RentShowComponent implements OnInit {
  title: string = ""
  rent: Rent
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user
  payment = PAYMENT

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private rentService: RentService,
    private permissionsService: NgxPermissionsService
  ) {
    this.rent = this.rentService.getRent()
    console.log('this.rent', this.rent)
    this.title = "Détails du " + this.rent.mois
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }
  printerRent(row): void {
    this.rentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
}
