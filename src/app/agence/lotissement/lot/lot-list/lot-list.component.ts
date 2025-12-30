import Swal from 'sweetalert2/dist/sweetalert2.js';
import { LotShowComponent } from '@lotissement/lot/lot-show/lot-show.component';
import { LotAddComponent } from '@lotissement/lot/lot-add/lot-add.component';
import { LotService } from '@service/lot/lot.service';
import { Lot } from '@model/lot';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lot-list',
  templateUrl: './lot-list.component.html',
  styleUrls: ['./lot-list.component.scss']
})
export class LotListComponent implements OnInit {
  @Input() lots: Lot[] = []
  dtOptions: any = {};
  etat: boolean = false
  total = 0
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private lotService: LotService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.lots ? true : false;
    this.lots.forEach(el=>{
      this.total = this.total + el?.montant
    })
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'LOT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'LOT_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  appendToList(item): void {
    this.lots.unshift(item);
  }
  update(item): void {
    const index = this.lots.findIndex(x => x.uuid === item.uuid );
    if (index !== -1) {
      this.lots[index] = item;
    }
  }
  editLot(row) {
    this.lotService.setLot(row)
    this.lotService.edit = true
    this.modal(LotAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showLot(row) {
    this.lotService.setLot(row)
    this.router.navigate(['/admin/lotissement/lot/show/' + row.uuid]);
  }
  printerLot(row): void {
    this.lotService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
          this.lotService.getDelete(item.uuid).subscribe(res => {
            if (res?.code === 200) {
              const index = this.lots.findIndex(x => x.uuid === item.uuid);
              if (index !== -1) {
                this.lots.splice(index, 1);
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
