import { Inventory } from '@model/inventory';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { VALIDATION } from '@theme/utils/functions';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '@service/inventory/inventory.service';
import { InventoryAddComponent } from '../inventory-add/inventory-add.component';

@Component({
  selector: 'app-inventory-show',
  templateUrl: './inventory-show.component.html',
  styleUrls: ['./inventory-show.component.scss']
})
export class InventoryShowComponent implements OnInit {
  title: string = '';
  inventory: Inventory;
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device};
  userSession = Globals.user;
  validation = VALIDATION;
  file: any;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.inventory = this.inventoryService.getInventory();
    this.title = 'Détail de l\'état des lieux '+this.inventory.contract.rental.libelle;
  }

  editInventory(row) {
    this.modalService.dismissAll();
    this.inventoryService.setInventory(row);
    this.inventoryService.edit = true;
    this.modal(InventoryAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerInventory(row): void {
    this.inventoryService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  formatDate(date) {
    return DateHelperService.fromJsonDate(date);
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
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
