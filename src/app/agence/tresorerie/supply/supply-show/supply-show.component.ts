import { SupplyService } from '@service/supply/supply.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Supply } from '@model/supply';
import { SupplyAddComponent } from '@agence/tresorerie/supply/supply-add/supply-add.component';
import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-supply-show',
  templateUrl: './supply-show.component.html',
  styleUrls: ['./supply-show.component.scss']
})
export class SupplyShowComponent implements OnInit {
  title: string = ""
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  supply: Supply
  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private supplyService: SupplyService
  ) {
    this.supply = this.supplyService.getSupply()
    this.title = "Détails du l'approvisionnement de " + this.supply?.code
  }
  ngOnInit(): void {
  }

  editSupply(row) {
    this.modalService.dismissAll()
    this.supplyService.setSupply(row)
    this.supplyService.edit = true
    this.supplyService.type = row.type
    this.modal(SupplyAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }

  printerSupply(row): void {
    this.supplyService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  modal(component, type, size, center, backdrop) {
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
