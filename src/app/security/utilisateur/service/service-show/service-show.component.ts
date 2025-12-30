import { Component, OnInit } from '@angular/core';
import { Service } from '@model/service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '@service/service/service.service';
import { Globals } from '@theme/utils/globals';
import { ServiceAddComponent } from '../service-add/service-add.component';

@Component({
  selector: 'app-service-show',
  templateUrl: './service-show.component.html',
  styleUrls: ['./service-show.component.scss']
})
export class ServiceShowComponent implements OnInit {
  title: string = ""
  service: Service
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private serviceService: ServiceService
  ) {
    this.service = this.serviceService.getService()
    this.title = "Détails du formule de " + this.service?.nom
  }

  ngOnInit(): void {
  }

  editService(row) {
    this.modalService.dismissAll()
    this.serviceService.setService(row)
    this.serviceService.edit = true
    this.modal(ServiceAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerService(row): void {
    this.serviceService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
