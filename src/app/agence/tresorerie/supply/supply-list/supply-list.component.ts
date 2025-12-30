import { SupplyShowComponent } from '@agence/tresorerie/supply/supply-show/supply-show.component';
import { SupplyAddComponent } from '@agence/tresorerie/supply/supply-add/supply-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SupplyService } from '@service/supply/supply.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Supply } from '@model/supply';
import { Component, OnInit, Input } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-supply-list',
  templateUrl: './supply-list.component.html',
  styleUrls: ['./supply-list.component.scss']
})
export class SupplyListComponent implements OnInit {
  @Input() supplies: Supply[]
  @Input() treasury: boolean = true
  type: string ="APPROVISIONNEMENT"
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  total = 0;
  constructor(
    private modalService: NgbModal,
    private supplyService: SupplyService,
    private emitter: EmitterService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.etat = this.supplies ? true : false;
    console.log(this.supplies)
    if(this.etat){
      this.supplies.forEach(item => { return this.total += item?.montant })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SUPPLY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'SUPPLY_UPDATED' || data.action === 'SUPPLY_VALIDATE') {
        this.update(data.payload);
      }
    });
  }
  appendToList(row): void {
    this.supplies.unshift(row);
  }
  update(row): void {
    const index = this.supplies.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.supplies[index] = row;
    }
  }
  editSupply(row) {
    this.supplyService.setSupply(row)
    this.supplyService.edit = true
    this.supplyService.type = row.type
    this.modal(SupplyAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  showSupply(row) {
    this.supplyService.setSupply(row)
    this.modal(SupplyShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerSupply(row): void {
    this.supplyService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  validateSupply(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet approvisiionnement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
      this.supplyService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'SUPPLY_VALIDATE', payload: res?.data});
          }
        }
      });
      }
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
        this.supplyService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.supplies.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.supplies.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
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
