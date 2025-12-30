import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VALIDATION } from '@theme/utils/functions';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, Input} from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import {DateHelperService} from '@theme/utils/date-helper.service';
import {InventoryService} from '@service/inventory/inventory.service';
import {InventoryModelAddComponent} from '@locataire/inventory-model/inventory-model-add/inventory-model-add.component';
import {InventoryShowComponent} from '@locataire/inventory/inventory-show/inventory-show.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { InventoryModel } from '@model/inventory-model';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { InventoryModelService } from '@service/inventory-model/inventory-model.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { InventoryModelShowComponent } from '../inventory-model-show/inventory-model-show.component';

@Component({
  selector: 'app-inventory-model-list',
  templateUrl: './inventory-model-list.component.html',
  styleUrls: ['./inventory-model-list.component.scss']
})
export class InventoryModelListComponent implements OnInit {

  @Input() models: InventoryModel[] = []
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  dtOptions: any = {};
  publicUrl = environment.publicUrl;

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private modelService: InventoryModelService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    
    this.emitter.event.subscribe((data) => {
      if (data.action === 'INVENTORY_MODEL_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'INVENTORY_MODEL_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.models.unshift(item);
  }
  update(item): void {
    const index = this.models.findIndex(x => x.uuid === item.uuid );
    if (index !== -1) {
      this.models[index] = item;
    }
  }
  edit(row) {
    this.modelService.setInventoryModel(row)
    this.modelService.edit = true
    this.modal(InventoryModelAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  show(row) {
    this.modelService.setInventoryModel(row)
    this.modal(InventoryModelShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerHome(row): void {
    this.modelService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
          this.modelService.getDelete(item.uuid).subscribe((res:any) => {
            if (res?.code === 200) {
              const index = this.models.findIndex(x => x.uuid === item.uuid);
              if (index !== -1) {
                this.models.splice(index, 1);
              }
              Swal.fire('', res?.message, res?.status);
            }
        }, error => {
          Swal.fire('', error.message, 'error');
        })
      }
    });
  }
}
