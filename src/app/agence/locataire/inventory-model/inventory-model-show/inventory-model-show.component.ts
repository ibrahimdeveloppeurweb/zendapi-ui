import { Inventory } from '@model/inventory';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { VALIDATION } from '@theme/utils/functions';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '@service/inventory/inventory.service';
import {InventoryModelAddComponent} from '@locataire/inventory-model/inventory-model-add/inventory-model-add.component';
import { InventoryModel } from '@model/inventory-model';
import { InventoryModelService } from '@service/inventory-model/inventory-model.service';


@Component({
  selector: 'app-inventory-model-show',
  templateUrl: './inventory-model-show.component.html',
  styleUrls: ['./inventory-model-show.component.scss']
})
export class InventoryModelShowComponent implements OnInit {
  title: string = ""
  model: InventoryModel

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private modelService: InventoryModelService
  ) {
    this.model = this.modelService.getInventoryModel()
    this.title = "Détails du model d\'etat des lieux "+ this.model?.type?.libelle
  }

  ngOnInit() {
  }

  edit(data) {
    this.modelService.setInventoryModel(data)
    this.modelService.edit = true
    this.modal(InventoryModelAddComponent, 'modal-basic-title', 'lg', true, 'static')
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
